import { SET_USER_SIGN_IN_DATA, SIGN_OUT_USER } from '../actions'

const initialState = {
    signInData: null,
    signedIn: false
}

const settings = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_SIGN_IN_DATA:
            return {
                ...state,
                signInData: action.userData,
                signedIn: true
            }
        case SIGN_OUT_USER:
            delete window.sessionStorage.signedIn
            return {
                ...state,
                signInData: null,
                signedIn: false
            }
        default:
            return state
    }
}

export default settings
