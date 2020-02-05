'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './step1.less'
import Loader from 'Base/loader'
import { sendReq, localAction } from 'Functions'
import { toast } from 'react-toastify';

class Step1 extends Component {
    constructor() {
        super()
        this.state = {}
    }

    /*    componentWillMount() {
           const { localAction } = this.props
           setTimeout(() => {
               localAction({ id: Date.now() }, 'NEW_SESSION')
           }, 1000)
       }
    */
    onSubmit = e => {
        e.preventDefault()
        const { next, localAction } = this.props,
            { client_fname, client_lname, client_id, check } = this.refs

        if (!check.checked) {
            this.setState({ error: 'יש ליידע את הלקוח לפני הבדיקה' })
            return
        }
        this.setState({ error: '', loading: true })
        const client = {
            client_fname: client_fname.value,
            client_lname: client_lname.value,
            client_id: client_id.value,
            tType: 'bdi'
        }


        sendReq('post', `transaction`, client)
            .then((data = {}) => {
                if (data.errors.bdi) throw data.errors.bdi
                const pass = String(data.recommendation || data.errors.recommendation).toLowerCase() == 'go'
                const res = {
                    pass,
                    client,
                    res: pass ? 'הבדיקה עברה בהצלחה , ניתן להתקדם לאישור סופי' : 'הבדיקה נכשלה ,יש לפנות לנציגי קלס להמשך טיפול'
                }
                localAction(res, 'BDI_SESSION')
                toast[pass ? 'success' : 'error'](pass ? 'בדיקה עברה בהצלחה ,הינך מועבר לבדיקת כ"א' : 'בדיקה נכשלה ,יש לפנות לנציגי קלס')
                next({ done: !pass })
            }).catch(error => {
                this.setState({ error: error.desc || error.message || error, loading: false })
            })

    }


    render() {
        this.props.name
        const { className = '', session = {} } = this.props,
            { error, loading } = this.state

        return session.id ? <div className={`${style.step1} ${className}`}>
            <form onSubmit={this.onSubmit}>
                <input minLength='2' ref='client_fname' type="text" placeholder='שם פרטי' required autoFocus />
                <input minLength='2' ref='client_lname' type="text" placeholder='שם משפחה' required />
                <input ref='client_id' type="number" placeholder='תעודת זהות' required />
                <label><input type='checkbox' ref='check' /><span>יידעתי את הלקוח</span></label>
                {error ? <div className={style.error}>{error}</div> : null}
                {loading ? <Loader /> : null}
                <input type='submit' value='שלח בדיקה' disabled={loading} />
            </form>
            <div className={style.text}>
                <p>שלום רב,<br />
                    <div><b>הנדון:</b>	הודעה בנוגע לקבלת חיווי אשראי</div>
                    הרינו להודיעך כי לצורך מתן אשראי לפי הסכם ההלוואה, אנו או גורמים אחרים בקבוצתנו נפנה לפי שיקול דעתנו ללשכת האשראי, קופאס בי.די.אי בע"מ ("לשכת האשראי"), לצורך קבלת חיווי אשראי אודותיך. פניה כאמור עשויה להתבצע בטרם מתן האשראי או קבלת כל תשלום לפי הסכם ההלוואה.<br />
                    לשם מתן החיווי הנ"ל, תגיש לשכת האשראי לבנק ישראל בקשה לקבלת נתוני אשראי אודותיך הכלולים במאגר נתוני האשראי של בנק ישראל שהוקם לפי חוק נתוני אשראי, התשע"ו-2016.<br />
                    ככל שהנך מאוגד כחברה, אנו צפויים לפנות ללשכת האשראי לצורך קבלת חיווי אשראי אודות בעלי המניות בחברתך. תשומת הלב כי הנך מתבקש להודיעם כאמור.<br />
                    <br />
                    בברכה,<br />
                    ק.ל.ס מימון רכב בע"מ</p>

                <p>تحية وبعد,<br />
                    <div><b>الموضوع:</b> إشعار بشأن الحصول على تقييم ائتمان</div>
                    نعلمك بهذا أنه لغرض منح الائتمان بموجب اتفاقية القرض, وفقًا لتقديرنا, سنتوجه إلى مكتب الائتمان, كوباس بي. دي. أي المحدوده ("مكتب الائتمان") للحصول على بيانات الائتمان الخاصة بك. هذا التوجه قد يتم قبل منح الأتمان أو تلقي أي مدفوعات منك بموجب هذه الاتفاقية.<br />
                    لتقديم هذا التقييم ، سيقدم مكتب الائتمان طلبًا إلى بنك إسرائيل لاستلام  بيانات الائتمان الخاصة بك والموجودة بقاعدة بيانات الائتمان لبنك إسرائيل التي انشأت بموجب قانون بيانات الائتمان, لسنة 2016.<br />
                    نظرًا لأنكم شركة، من المتوقع أن نتصل بمكتب الائتمان للحصول على بيان ائتماني بشأن المساهمين بالشركه. احرص على إبلاغ المساهمين بذلك.<br />
                    <br />
                    مع أطيب التحيات,<br />
                    ك.ل.س. تمويل المركبات المحدودة</p>

            </div>
        </div> : <Loader />
    }
}

export default connect(state => ({
    loggedIn: state.loggedIn,
    session: state.session
}), { localAction })(Step1)