'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './header.less'
import DropDown from 'Base/dropDown'
import { loguot, localAction } from 'Functions'
import logo from './logo'

const modes = [
    { text: 'בדיקה חדשה', value: 'regular' },
    { text: 'משתמשים', value: 'users' },
    /*  { text: 'טרנזקציות', value: 'transaction' } */
]

class Header extends Component {
    constructor() {
        super()
        this.state = {}
    }

    reset = () => {
        const { localAction } = this.props

        localAction({ id: Date.now() }, 'CLEAR_SESSION')
    }

    render() {
        const { children, className = '', loggedIn, setAppMode, appMode, localAction } = this.props

        return <>
            <div style={{ height: 80 }}></div>
            {children}
            <div className={`${style.header} ${className}`}>
                <div className={style.inner}>
                    <div className={style.hello}>{loggedIn.name ? <div>שלום, {loggedIn.first_name} <small onClick={loguot}>התנתק</small></div> : null}</div>
                    <div >{setAppMode ? <DropDown button='תפריט'>{
                        modes.map(item => <div
                            key={item.value}
                            onClick={() => { localAction({ id: Date.now() }, 'CLEAR_SESSION'); setAppMode(item.value) }}
                            className={`mItem ${item.value == appMode ? 'mItem-active' : ''}`}
                        >{item.text}</div>)
                    } </DropDown> : null}</div>
                </div>
                <div className={style.logo} >
                    <img src={logo} alt="logo" onClick={this.reset} />
                </div>
            </div>
        </>
    }
}

export default connect(state => ({
    loggedIn: state.loggedIn
}), { localAction })(Header)