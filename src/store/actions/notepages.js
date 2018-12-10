import {
  ADD_USER_NOTEPAGE,
  SET_USER_NOTEPAGES,
  UPDATE_USER_NOTEPAGE,
  REMOVE_USER_NOTEPAGE,
  SET_USER_SHARED
} from './index'

export function addUserNotepage (noteDetails) {
  return {
    type: ADD_USER_NOTEPAGE,
    noteDetails
  }
}

export function setUserNotepages (notepages) {
  return {
    type: SET_USER_NOTEPAGES,
    notepages
  }
}

export function updateUserNotepage (noteDetails, index) {
  return {
    type: UPDATE_USER_NOTEPAGE,
    noteDetails,
    index
  }
}

export function removeUserNotepage (index) {
  return {
    type: REMOVE_USER_NOTEPAGE,
    index
  }
}

export function setUserShared (notepages) {
  return {
    type: SET_USER_SHARED,
    notepages
  }
}
