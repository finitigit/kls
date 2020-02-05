'use strict'
import { __DEV__ } from 'Config'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import allReducers from './reducers'

const middlewares = [thunk, ...(__DEV__ ? [createLogger()] : [])],
    store = createStore(allReducers, applyMiddleware(...middlewares))

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.querySelector('#root')) 