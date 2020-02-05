export default (state = false, { type, payload }) => {
    switch (type) {
        case 'RELOGIN':
        case 'LOGIN':
            return payload
        default:
            return state;
    }
}
