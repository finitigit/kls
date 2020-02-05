'use strict'
import React, { Component } from 'react'
import style from './users.less'
import { sendReq } from 'Functions'
import Table from 'Base/table'
import Loader from 'Base/loader'
import UserForm from './userForm'

const headers = {
    username: "שם משתמש",
    first_name: "שם פרטי",
    last_name: "שם משפחה",
    phone: "טלפון",
    email: "אימייל",
    role: "הרשאה",
    permission: "כתיבה",
}

class Users extends Component {
    constructor() {
        super()
        this.state = {}
    }

    componentWillMount() {
        this.fetchData()
    }

    fetchData = () => {
        this.setState({ loading: true, error: undefined, users: undefined })
        sendReq('get', 'user')
            .then(users => this.setState({ loading: false, users }))
            .catch(error => this.setState({ loading: false, error }))
    }

    render() {
        const { className = '', } = this.props,
            { users, error, loading } = this.state

        return <>
            {loading && <Loader />}
            {users || error ? <div className={`${style.users} ${className}`}>{
                error ? <div>{error}</div> :
                    <Table title='משתמשים' list={users} headers={headers} SingleComponent={UserForm} fetchData={this.fetchData} />
            }</div> : null}
        </>
    }
}

export default Users