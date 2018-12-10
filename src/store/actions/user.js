import {
    SET_USER_SIGN_IN_DATA,
    SIGN_OUT_USER,
    SET_SIGN_IN_ATTEMPTED,
    SET_USER_SETTINGS
} from './index'

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

export function setSignInAttempted () {
    return {
        type: SET_SIGN_IN_ATTEMPTED
    }
}

export function setUserSettings (settings) {
    return {
        type: SET_USER_SETTINGS,
        settings
    }
}
