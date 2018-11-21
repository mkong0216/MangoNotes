import { SET_USER_NOTEPAGES, UPDATE_USER_NOTEPAGES } from './index'

export function setUserNotepages (notepages) {
  return {
    type: SET_USER_NOTEPAGES,
    notepages
  }
}

export function updateUserNotepages (noteDetails) {
  return {
    type: UPDATE_USER_NOTEPAGES,
    noteDetails
  }
}
