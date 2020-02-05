import React, { Component } from 'react'
import style from './loader.less'

class Loader extends Component {
    constructor() {
        super()
        this.state = {}
    }
    render() {
        const { className = '', } = this.props

        return <span className={`${style.loader} ${className}`}></span>
    }
}

export default Loader