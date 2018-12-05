import { SET_USER_SIGN_IN_DATA, SET_SIGN_IN_ATTEMPTED } from '../actions'

const initialState = {
    signInData: null,
    signedIn: false,
    signedInAttempted: false
}

const settings = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_SIGN_IN_DATA:
            return {
                ...state,
                signInData: action.userData,
                signedIn: true,
                signedInAttempted: true
            }
        case SET_SIGN_IN_ATTEMPTED:
            return {
                ...state,
                signedInAttempted: true
            }
        default:
            return state
    }
}

export default settings
