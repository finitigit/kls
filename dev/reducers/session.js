export default (state = { id: Date.now() }, { type, payload }) => {
    switch (type) {
        case 'NEW_SESSION':
            return payload
        case 'BDI_SESSION': {
            const tests = [...(state.tests || [])]
            tests.push({ name: 'bdi', ...payload })
            return {
                ...state,
                tests,
                client: payload.client,
                owner: payload.client
            }
        }
        case 'OWNER_SESSION': {
            return {
                ...state,
                owner: payload
            }
        }
        case 'J5_SESSION': {
            const tests = [...(state.tests || [])]
            tests.push({ name: 'j5', ...payload })
            return {
                ...state,
                tests
            }
        }
        case 'SAP_SESSION': {
            const tests = [...(state.tests || [])]
            tests.push({ name: 'sap', ...payload })
            return {
                ...state,
                tests
            }
        }
        case 'CLEAR_SESSION': {
            return { id: Date.now() }
        }
        default:
            return state;
    }
}