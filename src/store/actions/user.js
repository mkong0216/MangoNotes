import { SET_USER_SIGN_IN_DATA, SET_SIGN_IN_ATTEMPTED } from './index'

export function createUserSignInData (userData) {
    return {
        type: SET_USER_SIGN_IN_DATA,
        userData
    }
}

export function setSignInAttempted () {
    return {
        type: SET_SIGN_IN_ATTEMPTED
    }
}
