import React, { Component } from 'react'
import style from './dropDown.less'
//import Icon from 'Icon'

class DropDown extends Component {
    constructor() {
        super()
        this.state = {}
    }

    render() {
        const { className = '', icon, button, children, right } = this.props

        return <div className={`${style.dropDown} ${className} ${right ? style.right : ''}`}>
            {button /* || <Icon name={icon} className={style.icon} /> */}
            <div onClick={e => e.stopPropagation()} className={style.dropDownBox}>{children}</div>
        </div>
    }
}

export default DropDown