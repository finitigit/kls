'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './statusBar.less'
const letters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'],
    tests = ['bdi', 'j5', 'sap']


class StatusBar extends Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { className = '', list = [], current = 0, session = {}, goToStep, loggedIn } = this.props,
            admin = loggedIn.role == 'admin'

        return <div className={`${style.statusBar} ${className}`}>{list
            .map(({ name }, i) => {
                const curr = (session.tests || []).find(t => t.name == tests[i])
                return <div onClick={() => { if (admin) goToStep(i) }} style={{ cursor: admin ? 'pointer' : '', width: `calc((100% - ${((list.length - 1) * 30)}px) / ${list.length})` }}
                    className={`${style.step} ${current > i ? style.done : ''} ${current == i ? style.current : ''}`}>
                    <div className={style.title}>{i == list.length - 1 ? 'סיום' : `שלב ${letters[i]}'`}</div>
                    <div className={style.name}>{name} {curr ? <span>{curr.pass ? '✓' : '✗'}</span> : ''}</div>
                </div>
            })}</div>
    }
}


export default connect(state => ({
    session: state.session,
    loggedIn: state.loggedIn
}), {})(StatusBar)