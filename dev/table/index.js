'use strict'
import React, { Component } from 'react'
import style from './table.less'

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: props.list,
            sortDir: 1
        }
    }

    sort(key) {
        const { list, sort, sortDir } = this.state,
            dir = (sortDir * (sort == key ? -1 : 1))

        this.setState({
            sort: key,
            sortDir: dir,
            list: list.sort((a, b) => ((a[key] > b[key] ? 1 : -1) * dir))
        })

    }

    close = (refresh) => {
        const { fetchData } = this.props
        if (fetchData && refresh) fetchData()
        this.setState({ single: undefined })
    }

    render() {
        const { className = '', headers, SingleComponent, title = '' } = this.props,
            keys = Object.keys(headers),
            { list, sort = keys[0], sortDir, single } = this.state

        return <>
            <div className={style.topRow}>
                <h4>{title}</h4>
                <button onClick={() => this.setState({ single: 'add' })}>חדש</button>
            </div>
            <div className={`box ${style.tableW} ${className}`}>
                <table className={style.table}>
                    <thead><tr>{keys.map(key => <th onClick={() => this.sort(key)} key={key}>{headers[key]} {sort == key ? <span className={style.sort}>{sortDir == 1 ? '▼' : '▲'}</span> : ''} </th>)}</tr></thead>
                    <tbody>{list.map(item =>
                        <tr onClick={() => this.setState({ single: item })} key={item[keys[0]]}>{
                            keys.map(key => <td key={item[keys[0]] + key}>{item[key]}</td>)
                        }</tr>)
                    }</tbody>
                </table>
            </div>
            {single && <div className={style.singleW} onClick={e => { if (e.target == e.currentTarget) this.close() }}>
                <div className={`box ${style.single}`}><SingleComponent data={single} close={this.close} /></div>
            </div>}
        </>
    }
}

export default Table