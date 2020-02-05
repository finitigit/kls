'use strict'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './steps.less'
import StatusBar from './statusBar'
import Step from './step'
import StepBtns from './stepBtns'
import exportToPdf from '../exportToPdf'

class Steps extends Component {
    constructor() {
        super()
        this.state = { current: 0 }
    }

    setStep = (num, options = {}) => {
        const { list } = this.props,
            { current } = this.state,
            { done } = options

        this.setState({
            current: done ? (list.length - 1) : (current + num),
            valid: true
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.session.id != nextProps.session.id)
            this.reset()
    }

    export = () => {
        const { loggedIn, session } = this.props

        exportToPdf(session, loggedIn)
    }

    reset = () => {
        const { testNum = 0 } = this.state
        this.setState({ current: 0, valid: false, testNum: (testNum + 1) })
    }

    render() {
        const { className = '', session = {}, list = [] } = this.props,
            { current, valid, testNum = 0 } = this.state
        console.log(session)
        if (!list.length) return null

        return <div className={`${style.steps} ${className}`}>
            {(session.tests || []).length ? <button className={style.export} onClick={this.export}>לשמירת התוצאות לחץ כאן</button> : null}
            <StatusBar list={list} current={current} goToStep={step => { console.log(step); this.setState({ current: step }) }} />
            <div className={style.list}>{list.map((s, i) => <Step
                //key={testNum + session.id}
                current={s}
                currIndex={i}
                index={current}
                makeValid={() => this.setState({ valid: true })}
                next={(current == list.length - 1) ? undefined : options => this.setStep(1, options)}
                reset={this.reset}
            />)}</div>
            {/*  <StepBtns
                valid={true}
                next={(current == list.length - 1) ? undefined : () => this.setStep(1)}
                prev={current == 0 ? undefined : () => this.setStep(-1)}
            /> */}
        </div>
    }
}

export default connect(state => ({
    loggedIn: state.loggedIn,
    session: state.session
}), {})(Steps)