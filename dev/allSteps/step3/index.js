'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './step3.less'
import { sendReq, localAction } from 'Functions'
import Loader from 'Base/loader'
import { toast } from 'react-toastify';
const months = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']

class Step3 extends Component {
    constructor() {
        super()
        this.state = {
            arevim: 1,
            loanType: 1
        }
    }

    onSubmit = e => {
        e.preventDefault()
        const { next, localAction } = this.props
        let { form } = this.refs

        const values = Object.values(form).reduce((acc, curr) => curr.name ? ({ ...acc, [curr.name]: curr.value }) : acc, {})

        this.setState({ error: '', loading: true, submited: true })
        sendReq('post', `xmlModel`, values)
            .then(data => {
                const pass = data.length
                const res = {
                    pass,
                    res: data
                }
                localAction(res, 'SAP_SESSION')
                toast[pass ? 'success' : 'error'](pass ? 'הבדיקה עברה בהצלחה' : 'הבדיקה נכשלה ,יש לפנות לנציגי קלס להמשך טיפול')
                next({ done: !pass })
            }).catch(error => {
                this.setState({ error: error.message || error, loading: false })
            })
    }

    getArevim = () => {
        const { arevim } = this.state,
            arevimArr = []

        for (let index = 0; index < arevim; index++) {
            arevimArr.push(<div className={style.group}>
                <h4>ערב {index + 1}</h4>
                <label>
                    <span>תעודת זהות</span>
                    <input type='number' step='any' name={`Arev${index + 1}_Id`} placeholder='תעודת זהות' />
                </label>

                <label>
                    <span>שם</span>
                    <input type='text' name={`Arev${index + 1}_Name`} placeholder='שם' />
                </label>

                <label>
                    <span>עיר</span>
                    <input type='text' name={`Arev${index + 1}_City`} placeholder='עיר' />
                </label>

                <label>
                    <span>כתובת</span>
                    <input type='text' name={`Arev${index + 1}_Address`} placeholder='כתובת' />
                </label>

                <label>
                    <span>טלפון</span>
                    <input type='tel' name={`Arev${index + 1}_Phone`} placeholder='טלפון' />
                </label>

                <label>
                    <span>מייל</span>
                    <input type='email' name={`Arev${index + 1}_EMail`} placeholder='מייל' />
                </label>

                {(arevim > 2 || index != (arevim - 1)) ? null : <button onClick={e => {
                    e.preventDefault()
                    this.setState({ arevim: (arevim + 1) }, () => {
                        try {
                            console.log('ssfdsfdsfsw43r4resswer')
                            const content = document.getElementById('content2')
                            content.scrollTop = content.scrollHeight
                        } catch (error) {
                            console.log(error)
                        }
                    })
                }}>ערב נוסף</button>}
            </div>)

        }

        return arevimArr
    }

    render() {
        const { className = '', session = {} } = this.props,
            { loanType, loanAmt, submited, error, loading, startDate } = this.state,
            { client = {} } = session

        return <div className={`${style.step3} ${className} ${submited ? 'submited' : ''}`}>
            <form onSubmit={this.onSubmit} ref='form'>

                <h5>מאפייני עסקה</h5>
                <div className={style.group}>
                    <label>
                        <span>עלות רכב:*</span>
                        <input required type='number' step='any' name='CarCostAmt' placeholder='עלות רכב' />
                    </label>

                    <label>
                        <span>סכום הלוואה מבוקש:*</span>
                        <input required type='number' step='any' onChange={e => this.setState({ loanAmt: e.target.value })} name='LoanRequestAmt' placeholder='סכום הלוואה מבוקש' />
                    </label>

                    <label>
                        <span>סוג הלוואה:*</span>
                        <select defaultValue='1' onChange={e => this.setState({ loanType: e.target.value })} required name='LoanAmortScheduleCd' placeholder='סוג הלוואה' >
                            <option value='' >בחר</option>
                            <option value="1">שפיצר</option>
                            <option value="2">בלון</option>
                            <option value="3">שפיצר + בלון</option>

                        </select>
                    </label>

                    <label>
                        <span>סכום בלון:</span>
                        <input disabled={loanType != 3} max={loanAmt} required value={loanType == 1 ? 0 : (loanType == 3 ? undefined : loanAmt)} type='number' step='any' name='BallonAmt' placeholder='סכום בלון' />
                    </label>

                    <label>
                        <span>תקופת הלוואה (בחודשים):*</span>
                        <input required type='number' step='any' min={0} max={60} name='LoanPeriodCnt' placeholder='תקופת הלוואה (בחודשים)' />
                    </label>

                    <label>
                        <span>בנק מממן:*</span>
                        <select required name='BankNum' placeholder='בנק מממן' >
                            <option value='' >בחר</option>
                            <option value="0001">לאומי</option>
                            <option value="0002">הפועלים</option>
                            <option value="0004">מרכנתיל</option>
                            <option value="0006">דיסקונט</option>
                            <option value="0009">מזרחי</option>
                            {/* <option value="13">איגוד</option>
                            <option value="24">אוצר החייל</option>
                            <option value="11">דיסקונט</option>
                            <option value="12">הפועלים</option>
                            <option value="4">יהב</option>
                            <option value="54">ירושלים</option>
                            <option value="10">לאומי</option>
                            <option value="20">מזרחי טפחות</option>
                            <option value="46">מסד</option>
                            <option value="17">מרכנתיל</option>
                            <option value="31">הבינלאומי</option> */}
                        </select>
                    </label>

                    <label>
                        <span>מסלול ריבית:*</span>
                        <select defaultValue='2' required name='InterestTypeCd' placeholder='מסלול ריבית' >
                            <option value='' >בחר</option>
                            <option value="1">קבועה</option>
                            <option value="2">צ. מדד</option>
                            <option value="3">מרווח מהפריים</option>
                        </select>
                    </label>

                    <label>
                        <span>ריבית (באחוזים)*</span>
                        <input required type='number' step='any' min='0' name='InterestAmt' placeholder='ריבית (באחוזים)' />
                    </label>
                    <label>
                        <span>תאריך תשלום ראשון:*</span>
                        <input required type='date' name='PaymentStartDate' placeholder='תאריך תשלום ראשון' onChange={e => this.setState({ startDate: new Date(e.target.value) })} />
                        {startDate && <div>{startDate.getDate()} ב{months[startDate.getMonth()]}, {startDate.getFullYear()}</div>}
                        {/* <select required={false} name='PaymentStartDate' placeholder='תאריך תשלום ראשון' >
                            <option value="12/08/2019">12/08/2019</option>
                            <option value="22/08/2019">22/08/2019</option>
                            <option value="03/09/2019">03/09/2019</option>

                        </select> */}
                    </label>

                </div>

                <h5>מאפייני לווה - אישי</h5>
                <div className={style.group}>

                    <label>
                        <span>שם פרטי:*</span>
                        <input defaultValue={client.client_fname} required type='text' name='FirstName' placeholder='שם פרטי' />
                    </label>

                    <label>
                        <span>שם משפחה:*</span>
                        <input defaultValue={client.client_lname} required type='text' name='LastName' placeholder='שם משפחה' />
                    </label>

                    <label>
                        <span>תעודת זהות:*</span>
                        <input defaultValue={client.client_id} required type='number' step='any' name='ID' placeholder='תעודת זהות' />
                    </label>

                    <label>
                        <span>מגדר:</span>
                        <select name='Gender' placeholder='מגדר' >
                            <option value='' >בחר</option>
                            <option value="1">זכר</option>
                            <option value="2">נקבה</option>
                            <option value="3">אחר</option>

                        </select>
                    </label>

                    <label>
                        <span>תאריך הנפקת תעודת זהות:</span>
                        <input type='date' name='IDIssueDate' placeholder='תאריך הנפקת תעודת זהות' />
                    </label>

                    <label>
                        <span>תאריך לידה:</span>
                        <input type='date' name='BirthDate' placeholder='תאריך לידה' />
                    </label>

                    <label>
                        <span>טלפון:</span>
                        <input type='tel' name='Telephone' placeholder='טלפון' />
                    </label>

                    <label>
                        <span>טלפון נייד:*</span>
                        <input required type='tel' name='Cell' placeholder='טלפון נייד' />
                    </label>

                    <label>
                        <span>מייל:</span>
                        <input type='email' name='EMail' placeholder='מייל' />
                    </label>

                    <label>
                        <span>עיר:*</span>
                        <input required type='text' name='City' placeholder='עיר' />
                    </label>

                    <label>
                        <span>רחוב:*</span>
                        <input required type='text' name='Street' placeholder='רחוב' />
                    </label>

                    <label>
                        <span>מספר בית:*</span>
                        <input required type='number' step='any' name='StreetNum' placeholder='מספר בית' />
                    </label>

                    <label>
                        <span>מיקוד:*</span>
                        <input required type='number' step='any' name='ZipCode' placeholder='מיקוד' />
                    </label>

                    <label>
                        <span>מצב משפחתי:</span>
                        <select name='MaritialStatus' placeholder='מצב משפחתי' >
                            <option value='' >בחר</option>
                            <option value="1">נשוי</option>
                            <option value="2">אלמן</option>
                            <option value="4">גרוש</option>
                            <option value="6">רווק</option>
                            <option value="5">פרוד</option>
                            <option value="3">ידוע בציבור</option>

                        </select>
                    </label>

                    <label>
                        <span>מספר ילדים מתחת לגיל 22:</span>
                        <input type='number' step='any' name='ChildrenUnder22' placeholder='מספר ילדים מתחת לגיל 22' />
                    </label>

                    <label>
                        <span>השכלה:</span>
                        <select name='Knowledge' placeholder='השכלה' >
                            <option value='' >בחר</option>
                            <option value="1">אקדמאית</option>
                            <option value="2">על תיכונית</option>
                            <option value="3">תיכונית</option>
                            <option value="4">סטודנט</option>
                            <option value="5">יסודית</option>

                        </select>
                    </label>

                    <label>
                        <span>מעמד תעסוקתי:</span>
                        <select name='EmploymentType' placeholder='מעמד תעסוקתי' >
                            <option value='' >בחר</option>
                            <option value="1">שכיר</option>
                            <option value="2">פנסיונר</option>
                            <option value="3">עצמאי</option>
                            <option value="4">מובטל</option>
                            <option value="5">חופשת לידה</option>
                            <option value="6">חופשת מחלה</option>

                        </select>
                    </label>

                    <label>
                        <span>תחום עיסוק:</span>
                        <select name='WorkType' placeholder='תחום עיסוק' >
                            <option value='' >בחר</option>
                            <option value="1">מובטל</option>
                            <option value="2">גופים ממשלתיים וסקטורים ציבוריים</option>
                            <option value="3">תאגידים פיננסים</option>
                            <option value="4">תאגידים - לא פיננסים</option>
                            <option value="5">עוסקים מורשים ומשקי בית</option>
                            <option value="6">מלכ"רים</option>

                        </select>
                    </label>

                    <label>
                        <span>מקום העבודה:</span>
                        <input type='text' name='WorkPlaceDesc' placeholder='מקום העבודה' />
                    </label>

                    <label>
                        <span>טלפון במקום העבודה:</span>
                        <input type='tel' name='WorkPlacePhone' placeholder='טלפון במקום העבודה' />
                    </label>

                    <label>
                        <span>ותק במקום העבודה:</span>
                        <select name='WorkPlaceSiniority' placeholder='ותק במקום העבודה' >
                            <option value='' >בחר</option>
                            <option value="1">לא עובד</option>
                            <option value="2">עד שנה</option>
                            <option value="3">1</option>
                            <option value="4">2</option>
                            <option value="5">3</option>
                            <option value="6">4</option>
                            <option value="7">5</option>
                            <option value="8">6</option>
                            <option value="9">7</option>
                            <option value="10">8</option>
                            <option value="11">9</option>
                            <option value="12">10</option>
                            <option value="13">יותר מ 10</option>

                        </select>
                    </label>
                </div>

                <h5>מאפייני לווה - פיננסי</h5>
                <div className={style.group}>

                    <label>
                        <span>הכנסת המבקש נטו (חודשי):</span>
                        <input type='number' step='any' name='NetIncome' placeholder='הכנסת המבקש נטו (חודשי)' />
                    </label>


                    <label>
                        <span>סך הכנסת משק הבית נטו (חודשי):</span>
                        <input type='number' step='any' name='HouseholdNetIncome' placeholder='סך הכנסת משק הבית נטו (חודשי)' />
                    </label>

                    <label>
                        <span>סוג המגורים:</span>
                        <select name='ResidenceOwnership' placeholder='סוג המגורים' >
                            <option value='' >בחר</option>
                            <option value="1">דירה בבעלות</option>
                            <option value="2">דירה שלא בבעלות אך בעלים של דירה למגורים</option>
                            <option value="3">דירה שלא בבעלות ואינו בעלים של דירה למגורים</option>

                        </select>
                    </label>

                    <label>
                        <span>החזר שכירות (חודשי):</span>
                        <input type='number' step='any' name='Rent' placeholder='החזר שכירות (חודשי)' />
                    </label>

                    <label>
                        <span>החזר משכנתא  (חודשי):</span>
                        <input type='number' step='any' name='MorgageReturn' placeholder='החזר משכנתא  (חודשי)' />
                    </label>


                    <label>
                        <span>החזר הלוואות אחרות והוצאות קבועות אחרות שהינן חלק מהוצאות משק הבית (חודשי):</span>
                        <input type='number' step='any' name='OtherExpenses' placeholder='החזר הלוואות אחרות והוצאות קבועות אחרות שהינן חלק מהוצאות משק הבית (חודשי)' />
                    </label>

                    <label>
                        <span>וותק בחשבון הבנק:</span>
                        <input type='number' step='any' name='BankSiniority' placeholder='וותק בחשבון הבנק' />
                    </label>

                    <label>
                        <span>מספר כרטיסי אשראי עם מסגרת:</span>
                        <input type='number' step='any' name='CreditCardsCount' placeholder='מספר כרטיסי אשראי עם מסגרת' />
                    </label>

                </div>
                <h5>נתוני רכב</h5>
                <div className={style.group}>
                    <label>
                        <span>יצרן:</span>
                        <input type='text' name='Manufacturer' placeholder='יצרן' />
                    </label>

                    <label>
                        <span>דגם</span>
                        <input type='text' name='Model' placeholder='דגם' />
                    </label>

                    <label>
                        <span>בעלות קודמת:</span>
                        <select name='PreviousOwnerType' placeholder='בעלות קודמת' >
                            <option value='' >בחר</option>
                            <option value="1">פרטי</option>
                            <option value="2">ליסינג</option>
                            <option value="3">השכרה</option>
                            <option value="4">חברה</option>
                            <option value="5">אחר</option>

                        </select>
                    </label>

                    <label>
                        <span>שנת עלייה לכביש: (yyyy)</span>
                        <input type='number' step='any' name='RoadYear' placeholder='שנת עלייה לכביש (yyyy)' />
                    </label>

                    <label>
                        <span>מספר רישוי</span>
                        <input type='number' step='any' name='LicencePlate' placeholder='מספר רישוי' />
                    </label>

                    <label>
                        <span>שלדה</span>
                        <input type='text' name='Chassis' placeholder='שלדה' />
                    </label>

                    <label>
                        <span>קוד דגם לוי יצחק</span>
                        <input type='text' name='ItzakCode' placeholder='קוד דגם לוי יצחק' />
                    </label>

                </div>
                {/* 
                <h5>נתוני ערבים</h5>

                {this.getArevim()} */}

                <hr />
                {error ? <div className={style.error}>{error}</div> : null}
                {loading ? <Loader /> : null}
                <input type="submit" disabled={loading} value="שלח" onClick={() => this.setState({ submited: true })} />
            </form>
        </div >
    }
}

export default connect(state => ({
    loggedIn: state.loggedIn,
    session: state.session
}), { localAction })(Step3)