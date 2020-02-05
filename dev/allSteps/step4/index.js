'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './step4.less'
import { localAction } from 'Functions'

class Step4 extends Component {
    constructor() {
        super()
        this.state = {}
    }

    reset = () => {
        const { reset, localAction } = this.props

        reset()
        localAction({ id: Date.now() }, 'CLEAR_SESSION')
    }

    render() {
        const { className = '', session = {} } = this.props,
            { client = {}, tests = [] } = session

        return <div className={`${style.step4} ${className}`}>
            <h1><strong>תוצאות עבור:</strong> {client.client_fname} {client.client_lname}, {client.client_id}</h1>

            <table>
                <thead>
                    <tr>
                        <th>שם הבדיקה</th>
                        <th>תוצאה</th>
                        <th>הערות/סיבה</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map(test => <tr>
                        <td>{test.name}</td>
                        <td><div className={`${style.vix} ${style[test.pass ? 'v' : 'x']}`}>{test.pass ? '✓' : '✗'}</div></td>
                        <td>{test.name == 'sap' ? test.res.map(r => <div><label>מספר חוזה:</label><span>{r}</span></div>) : test.res}</td>
                    </tr>)}
                </tbody>
            </table>

            <button onClick={this.reset}>לבדיקה חדשה</button>
        </div>
    }
}


export default connect(state => ({
    loggedIn: state.loggedIn,
    session: state.session
}), { localAction })(Step4)