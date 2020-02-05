'use strict'
const
    axios = require('axios'),
    env = process.env.NODE_ENV || 'development',
    config = {
        production: {
            production: true,
            secret: 'XCSTSaU59ZrhWMSD'
        },
        development: {
            development: true,
            secret: 'f7mbN87cW8jGwkns',
        }
    }, common = {
        env,
        xmlKey: '2B7E151628AED2A6ABF7158809CF4F3C',
        baseUrl: process.env.BDI_URL || 'https://bdireq.azurewebsites.net/',
        port: process.env.PORT || 1200,
        xmlUrl: process.env.XML_URL || 'http://sappiqas.mct.co.il:50200/XISOAPAdapter/MessageServlet?senderParty=&senderService=BC_KLS&receiverParty=&receiverService=&interface=CreateLoanEncrypt_Outb_SI&interfaceNamespace=urn:mct.co.il:erp:KLS:CreateLoan'
    }

axios.defaults.baseURL = config.baseUrl

global.sendReq = axios

global.config = { ...common, ...config[env] }

global.log = console.log
