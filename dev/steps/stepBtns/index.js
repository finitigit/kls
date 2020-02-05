'use strict'
import React, { Component } from 'react'
import style from './stepBtns.less'

class StepBtns extends Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { className = '', prev, next, valid } = this.props

        return <div className={`${style.stepBtns} ${className}`}>
            <button onClick={prev} className={`${prev ? '' : style.hide}`}>הקודם</button>
            <button onClick={valid ? next : undefined} className={`${next ? '' : style.hide}`} disabled={!valid}>הבא</button>
        </div>
    }
}

export default StepBtns