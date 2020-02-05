import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './app.less'
import Header from 'Base/header'
import Login from 'Base/login'
import LoanCheck from 'Base/loanCheck'
import { sendReq, localAction } from 'Functions'
import Loader from 'Base/loader'
import Users from 'Base/users'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
    constructor() {
        super()
        this.state = {
            appMode: 'regular',
            loading: true
        }
    }

    componentWillMount() {
        const { localAction } = this.props

        sendReq('post', 'user/relogin')
            .then(data => {
                data.name = `${data.first_name} ${data.last_name}`
                localAction(data, 'RELOGIN')
                this.setState({ loading: false })
            })
            .catch(err => {
                this.setState({ loggedIn: undefined, loading: false })
            })
    }

    getApp() {
        const { loggedIn, appMode } = this.state
        let app
        switch (appMode) {
            case 'users':
                app = <Users />
                break;

            case 'sessions':
                app = 'sessions'
                break;

            default:
                app = <LoanCheck loggedIn={loggedIn} />
                break;
        }
        return app
    }

    render() {
        const { className = '', loggedIn = {} } = this.props,
            { loading, appMode } = this.state,
            { name } = loggedIn

        return <div className={`${style.app} ${className}`}>
            <div className='submited'></div>
            <ToastContainer position='bottom-center' />
            <Header
                appMode={appMode}
                setAppMode={loggedIn.role == 'admin' ? appMode => this.setState({ appMode }) : undefined}
            >
                {loading ? <Loader /> : (
                    name ?
                        this.getApp()
                        : <Login onLogin={loggedIn => this.setState({ loggedIn })} />)
                }
            </Header>
        </div>
    }
}


export default connect(state => ({
    loggedIn: state.loggedIn
}), { localAction })(App)