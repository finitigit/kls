'use strict'
import React, { Component } from 'react'
import style from './login.less'
import Loader from 'Base/loader'
import { sendReq, localAction } from 'Functions'
import { connect } from 'react-redux'

class Login extends Component {
    constructor() {
        super()
        this.state = {}
    }

    isValid(name, password) {
        if (name && password)
            return true

        this.setState({ error: 'נא להזין שם משתמש וסיסמא' })
    }

    onSubmit = e => {
        e.preventDefault()
        const { localAction } = this.props
        let { name, password } = this.refs

        name = name.value
        password = password.value

        if (this.isValid(name, password)) {

            this.setState({ error: '', loading: true })
            sendReq('get', `user/${name}?p=${password}`, undefined, { login: true })
                .then(data => {
                    data.name = `${data.first_name} ${data.last_name}`
                    localAction(data, 'LOGIN')
                }).catch(error => {
                    this.setState({ error: error.message || error, loading: false })
                })
        }
    }

    render() {
        const { className = '' } = this.props,
            { error, loading } = this.state

        return <div className={`${style.login} ${className} box`}>
            <h1>כניסה</h1>
            <h4>הזן את שם המשתמש והסיסמא שלך על מנת להכנס</h4>
            <form onSubmit={this.onSubmit}>
                <input ref="name" type="text" placeholder="שם משתמש" autoFocus />
                <input ref="password" type="password" placeholder="סיסמא" />
                {error ? <div className={style.error}>{error}</div> : null}
                {loading ? <Loader /> : null}
                <input type='submit' value='כניסה' disabled={loading} />
            </form>
        </div>
    }
}


export default connect(state => ({
    loggedIn: state.loggedIn
}), { localAction })(Login)