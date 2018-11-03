import { SET_USER_SIGN_IN_DATA } from '../actions'

const initialState = {
    userId: null,
    signedIn: false
}

const settings = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_SIGN_IN_DATA:
            return {
                ...state,
                userId: action.userId,
                signedIn: true
            }
        default:
            return state
    }
}

export default settings
