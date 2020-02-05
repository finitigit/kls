'use strict'
import React, { Component } from 'react'
import style from './step.less'

class Step extends Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { className = '', current = {}, index, currIndex, makeValid, next, stepsData, reset } = this.props,
            { title, subTitle, Comp } = current

        return <div className={`box ${style.step} ${className}`}
            style={currIndex == index ? {} : { transform: 'scale(.7)', right: `${currIndex > index ? '' : '-'}100%`, opacity: 0 }}>
            <h1>{title}</h1>
            {subTitle && <h4>{subTitle}</h4>}
            <div className={style.content} id={`content${currIndex}`}>
                {Comp && <Comp makeValid={makeValid} next={next} stepsData={stepsData} reset={reset} />}
            </div>
        </div>
    }
}

export default Step