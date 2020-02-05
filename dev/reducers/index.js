import { combineReducers } from 'redux'
import loggedIn from './loggedIn'
import session from './session'

const allReducers = combineReducers({
    loggedIn,
    session,
})

const rootReducer = (state, action) => {
    if (action.type === 'LOGOUT')
        state = {}
    return allReducers(state, action)
}

export default rootReducer
