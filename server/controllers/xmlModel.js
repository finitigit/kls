
const
    js2xmlparser = require('js2xmlparser'),
    { parseString } = require('xml2js'),
    aesjs = require('aes-js'),
    DB = require('../DB')

// FINAL VALUES
const
    VAT = 0.17,
    FEE_PERCENT = 0.015,
    FIXED_COST = 450

const create = async (data = {}) => {
    const ApplicationID = Date.now()

    await DB.log('JSON Data', { ...data, _user: undefined }, ApplicationID, data._user.username)

    const XML = prepareXML(data, ApplicationID)

    await DB.log('XML Data', XML, ApplicationID, data._user.username)

    const encryptedXML = aesEncrypt(XML)

    await DB.log('Encrypted XML Data', encryptedXML, ApplicationID, data._user.username)

    try {
        const reqBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ><soapenv:Header/><soapenv:Body><urn:CreateLoanEncrypt_Req_MT xmlns:urn="urn:mct.co.il:erp:KLS:CreateLoan"><Key>${ApplicationID}</Key><Content>${encryptedXML}</Content> <CreateLoan_Req_MT></CreateLoan_Req_MT></urn:CreateLoanEncrypt_Req_MT></soapenv:Body></soapenv:Envelope>`,
            res = await sendReq.post(config.xmlUrl, reqBody, { headers: { 'Content-Type': 'text/xml;charset=UTF-8', Authorization: 'Basic S0xTX1VTRVI6S2xzNTc4NTI='/* 'Basic eW9uaXNoOmROQ19jSDY3' */ } })

        console.log('pss', 'S0xTX1VTRVI6S2xzNTc4NTI=')

        let loans
        parseString(res.data, { trim: true, explicitArray: false }, (err, result) => {
            if (err) throw err

            DB.log('RESULTS SAP', res.data, ApplicationID, data._user.username)
            console.log('res sap', res.data)

            const body = result['SOAP:Envelope']['SOAP:Body']['ns0:CreateLoanEncrypt_Res_MT'],
                { ErrorDesc, ErrorCode, Loans } = body

            if (ErrorCode == '2') throw `עיכוב בקבלת הנתונים, יש לנסות שוב בעוד 30 שניות`
            if (ErrorDesc || ErrorCode) throw `SAP error: ${ErrorDesc} (${ErrorCode})`

            loans = ((Array.isArray(Loans)) ? Loans : [Loans]).map(l => (l || {}).ContractNum)
            console.log('res sap2', body, Loans, loans)
        })

        return loans

    } catch (err) {
        await DB.log('ERROR SAP', err, ApplicationID, data._user.username)
        console.log('err sap', err, ApplicationID)
        throw `Unexpected error: ${err.context || err.message || JSON.stringify(err)}`
    }
}

function prepareXML(data, ApplicationID) {

    const xmlData = {
        CarCenterMail: 'test@carcenter.com',
        ApplicationID,

        LoanRequestAmt: data.LoanRequestAmt,
        CarCostAmt: data.CarCostAmt,
        BankNum: data.BankNum,

        ExecutionDate: dateFormat(new Date),
        Date: dateFormat(new Date),

        ApplicationFeeAmt: getApplicationFee(data.LoanRequestAmt, { calcVat: false }),
        LevarageRel: data.LoanRequestAmt / data.CarCostAmt,
        AdvanceAmt: data.CarCostAmt - data.LoanRequestAmt,

        RepUserId: data._user.username,
        RepSnifId: 1,

        Car: ['Manufacturer', 'Model', 'RoadYear', 'Chassis', 'LicencePlate', 'ItzakCode'].reduce((acc, curr) => ({ ...acc, [curr]: data[curr] }), {}),
        ApplicationCust: ['ID', 'BirthDate', 'FirstName', 'LastName', 'BirthDate', 'EMail', 'Telephone', 'Cell', 'City', 'Street', 'StreetNum', 'ZipCode', 'WorkPlaceDesc', 'WorkPlacePhone'].reduce((acc, curr) => ({ ...acc, [curr]: data[curr] }), {}),

        Loan: getLoansData(data),
    }
    xmlData['@'] = { 'xmlns:ns0': 'urn:mct.co.il:erp:KLS:CreateLoan' }

    const xml = js2xmlparser.parse('ns0:CreateLoan_Req_MT', xmlData)
        .replace("<?xml version='1.0'?>", '').trim()

    return xml
}

function dateFormat(date, options = {}) {
    date = new Date(date)

    const { fullYear = true, seperator = '-' } = options,
        dd = date.getDate(),
        mm = date.getMonth() + 1,
        yy = date.getFullYear() - (fullYear ? 0 : 2000)

    return `${yy}${seperator}${mm < 10 ? '0' : ''}${mm}${seperator}${dd < 10 ? '0' : ''}${dd}`
}

function getLoansData(data) {
    const loans = [],
        loanType = Number(data.LoanAmortScheduleCd),
        InterestAmt = (Number(data.InterestAmt) / 100) / (1 + VAT)
    /*
       loanTypes:
        1: shpizer
        2: ballon
        3: shpizer + ballon
    */

    if (loanType == 1 || loanType == 3) {
        const loanAmt = Number(data.LoanRequestAmt) - Number(data.BallonAmt || 0)
        loans.push({
            LoanAmortScheduleCd: 1,
            CuerrencyTypeCd: 'ILS',
            BallonType: 1,
            BallonAmt: 0,

            LoanRequestAmt: loanAmt,

            LoanPeriodCnt: data.LoanPeriodCnt,
            PaymentStartDate: dateFormat(data.PaymentStartDate),
            InterestTypeCd: data.InterestTypeCd,

            InterestAmt,
            InterestEffAmt: calcEffectiveInterest(data.InterestAmt),
            ApplicationLoanAmountIncFee: Number(Number(loanAmt) + getApplicationFee(data.LoanRequestAmt, { calcVat: true })).toFixed(0)
        })
    }

    if (loanType == 2 || loanType == 3) {
        const loanAmt = data.BallonAmt
        loans.push({
            LoanAmortScheduleCd: 2,
            CuerrencyTypeCd: 'ILS',
            BallonType: 1,

            BallonAmt: data.BallonAmt,
            LoanRequestAmt: data.BallonAmt,

            LoanPeriodCnt: data.LoanPeriodCnt,
            PaymentStartDate: dateFormat(data.PaymentStartDate),
            InterestTypeCd: data.InterestTypeCd,

            InterestAmt,
            InterestEffAmt: calcEffectiveInterest(data.InterestAmt),
            ApplicationLoanAmountIncFee: Number(Number(loanAmt) + (loanType == 2 ? getApplicationFee(loanAmt, { calcVat: true }) : 0)).toFixed(0)
        })
    }

    return loans
}

function calcEffectiveInterest(nominalRate, Npery = 12) {
    nominalRate /= 100
    let result = 1 + (nominalRate / Npery)
    result = ((Math.pow(result, Npery)) - 1) * 100
    return result.toFixed(2)
}

function getApplicationFee(loanAmt, options = {}) {
    const { calcVat } = options
    let fee = (FIXED_COST + (FEE_PERCENT * Number(loanAmt)))

    if (calcVat) fee *= (1 + VAT)
    return Number(fee.toFixed(2))
}

function aesEncrypt(text) {
    const key = aesjs.utils.hex.toBytes(config.xmlKey),
        textBytes = aesjs.utils.utf8.toBytes(text),
        aesEcb = new aesjs.ModeOfOperation.ecb(key),
        paddingTextBytes = new Uint8Array(textBytes.byteLength + (16 - (textBytes.byteLength % 16)))

    paddingTextBytes.set(textBytes)

    const encryptedBytes = aesEcb.encrypt(paddingTextBytes),
        encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    return encryptedHex
}

module.exports = { create }