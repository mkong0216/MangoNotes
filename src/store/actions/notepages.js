import { CREATE_NEW_NOTEPAGE, SET_USER_NOTEPAGES } from './index'

export function createNewNotePage (notepageDetails) {
  return {
    type: CREATE_NEW_NOTEPAGE,
    notepageDetails
  }
}

export function setUserNotepages (notepages) {
  return {
    type: SET_USER_NOTEPAGES,
    notepages
  }
}
