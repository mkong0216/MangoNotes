import { SET_USER_NOTEBOOKS, UPDATE_USER_NOTEBOOKS } from './index'

export function setUserNotebooks (notebooks) {
  return {
    type: SET_USER_NOTEBOOKS,
    notebooks
  }
}

export function updateUserNotebooks (noteDetails) {
  return {
    type: UPDATE_USER_NOTEBOOKS,
    noteDetails
  }
}