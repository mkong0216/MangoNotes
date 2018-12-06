import { SET_USER_SIGN_IN_DATA, SIGN_OUT_USER } from './index'

export function createUserSignInData (userData) {
    return {
        type: SET_USER_SIGN_IN_DATA,
        userData
    }
}

export function signOutUser () {
    return {
        type: SIGN_OUT_USER
    }
}
