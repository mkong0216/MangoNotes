import { SET_USER_SIGN_IN_DATA } from '../actions'

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
        default:
            return state
    }
}

export default settings
