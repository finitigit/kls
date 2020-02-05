'use strict'
import React, { Component } from 'react'
import style from './users.less'
import Loader from 'Base/loader'
import { sendReq } from 'Functions'

class UserForm extends Component {
    constructor() {
        super()
        this.state = {}
    }

    delete = () => {
        const { data: user, close } = this.props

        this.setState({ error: '', loading: true })
        sendReq('delete', `user/${user.username}`)
            .then(data => {
                close(true)
            }).catch(error => {
                this.setState({ error: error.message || error, loading: false })
            })
    }

    onSubmit = (e) => {
        e.preventDefault()
        const { data: user, close } = this.props
        const values = Object.values(e.target).reduce((acc, curr) => curr.name ? ({ ...acc, [curr.name]: curr.value }) : acc, {})
        if (!values.password) delete values.password
        this.setState({ error: '', loading: true })
        sendReq(user == 'add' ? 'post' : 'put', `user`, values)
            .then(data => {
                close(true)
            }).catch(error => {
                this.setState({ error: error.message || error, loading: false })
            })
    }

    render() {
        const { data: user } = this.props,
            { error, loading } = this.state,
            pp = `סיסמה${user == 'add' ? '' : ' - רק אם רוצים לשנות'}`

        return <form onSubmit={this.onSubmit}>
            <h1>{user == 'add' ? 'הוספת' : 'עריכת'} משתמש</h1>
            <div className={style.formW}>
                <input name='first_name' type="text" required minLength='2' placeholder='שם פרטי' title='שם פרטי' defaultValue={user.first_name} />
                <input name='last_name' type="text" required minLength='2' placeholder='שם משפחה' title='שם משפחה' defaultValue={user.last_name} />
                <input name='phone' type="tel" required minLength='2' placeholder='טלפון' title='טלפון' defaultValue={user.phone} />
                <input name='email' type="email" required minLength='2' placeholder='דוא"ל' title='דוא"ל' defaultValue={user.email} />
                <select name='role' required title='הרשאה' defaultValue={user.role}>
                    <option value="">בחר הרשאה</option>
                    <option value="regular">רגיל</option>
                    <option value="admin">מנהל</option>
                </select>
                <select name='permission' required title='כתיבה/קריאה' defaultValue={user.permission}>
                    <option value="">בחר: כתיבה/קריאה</option>
                    <option value="read">קריאה</option>
                    <option value="write">כתיבה</option>
                </select>
                <input name='username' type="text" required minLength='4' placeholder='שם משתמש' title='שם משתמש' defaultValue={user.username} />
                <input name='password' type="text" minLength='6' placeholder={pp} title={pp} />
            </div>
            {error ? <div className={style.error}>{error}</div> : null}
            {loading ? <Loader /> : null}
            <input type="submit" value={user == 'add' ? 'הוסף' : "עדכן"} disabled={loading} />
            {user == 'add' ? null : <h4 className={style.del} onClick={this.delete}>מחיקת משתמש זה</h4>}
        </form>
    }
}

export default UserForm