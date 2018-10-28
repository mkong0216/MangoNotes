import { SET_USER_SIGN_IN_DATA } from './index'

export function createUserSignInData (userId) {
    return {
        type: SET_USER_SIGN_IN_DATA,
        userId
    }
}
