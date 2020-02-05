'use strict'
import React, { Component } from 'react'
import style from './step2.less'
import Loader from 'Base/loader'
import { connect } from 'react-redux'
import { localAction } from 'Functions'
import { toast } from 'react-toastify';

class Step2 extends Component {
    constructor() {
        super()
        this.state = {}
    }

    getIframe() {
        const { session = {}, next, localAction } = this.props,
            { client = {} } = session,
            query = {
                action: 'pay',
                Info: 'בדיקת j5 ',
                Masof: '4500304835',
                Amount: 10,
                UTF8: 'True',
                UTF8out: 'True',
                ClientName: client.client_fname,
                ClientLName: client.client_lname,
                UserId: client.client_id,
                Tash: 1,
                MoreData: 'True',
                Coin: 1,
                J5: 'True',
                tmp: 7,
                FixTash: 'True',
                PassP: 1234
            },
            queryStr = Object.keys(query).reduce((acc, curr) => (acc + `&${curr}=${query[curr] || ''}`), 'https://icom.yaad.net/p/?')

        return <div className={style.iframeWrapper}>
            <Loader />
            <iframe className={style.iframe} src={encodeURI(queryStr)} frameBorder='0' onLoad={e => {
                try {
                    const query = JSON.parse(e.target.contentDocument.body.firstChild.innerText),
                        pass = query.CCode == '700',
                        res = { res: pass ? 'בדיקת כרטיס אשראי עברה בהצלחה' : query.errMsg, pass }
                    localAction(res, 'J5_SESSION')
                    toast[pass ? 'success' : 'error'](pass ? 'בדיקת כרטיס אשראי עברה בהצלחה' : 'בדיקה נכשלה ,יש לפנות לנציגי קלס')
                    next({ done: !res.pass })
                } catch (error) {
                    console.log(error)
                }
            }}></iframe>
        </div>
    }

    onSubmit = e => {
        e.preventDefault()

        const { localAction } = this.props,
            { client_fname, client_lname, client_id } = this.refs

        localAction({
            client_fname: client_fname.value,
            client_lname: client_lname.value,
            client_id: client_id.value,
        }, 'OWNER_SESSION')
        this.setState({ changeOwner: false })
    }

    render() {
        const { className = '', session = {} } = this.props,
            { changeOwner, loading, error } = this.state,
            { owner = {} } = session

        return changeOwner ?
            <form className={`${style.step2} ${className}`} onSubmit={this.onSubmit}>
                <input minLength='2' ref='client_fname' type="text" placeholder='שם פרטי' required autoFocus />
                <input minLength='2' ref='client_lname' type="text" placeholder='שם משפחה' required />
                <input ref='client_id' type="number" placeholder='תעודת זהות' required />
                {error ? <div className={style.error}>{error}</div> : null}
                {loading ? <Loader /> : null}
                <input type='submit' value='עדכן פרטי בעל הכרטיס' disabled={loading} />
                <span className={style.change} onClick={() => this.setState({ changeOwner: false })}>ביטול</span>
            </form> :
            <div className={`${style.step2} ${className}`}>
                {/*  <div>האם פרטי בעל הכרטיס הם: <b>{owner.client_fname} {owner.client_lname} {owner.client_id}</b>? אחרת
            <span className={style.change} onClick={() => this.setState({ changeOwner: true })}>לחץ כאן  לשינוי</span>
                </div> */}
                {owner.client_id || true ? this.getIframe() : null}
                <h2>עבור פעולה זו , לא יחויב כרטיס האשראי</h2>
                <h3>לא ניתן לבדוק כרטיסי דיינרס או אמריקן אקספרס</h3>
            </div>
    }
}

export default connect(state => ({
    loggedIn: state.loggedIn,
    session: state.session
}), { localAction })(Step2)