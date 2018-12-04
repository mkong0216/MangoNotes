import {
  ADD_USER_NOTEBOOK,
  SET_USER_NOTEBOOKS,
  UPDATE_USER_NOTEBOOK,
  REMOVE_USER_NOTEBOOK
} from './index'

export function addUserNotebook (noteDetails) {
  return {
    type: ADD_USER_NOTEBOOK,
    noteDetails
  }
}

export function setUserNotebooks (notebooks) {
  return {
    type: SET_USER_NOTEBOOKS,
    notebooks
  }
}

export function updateUserNotebook (noteDetails, index) {
  return {
    type: UPDATE_USER_NOTEBOOK,
    noteDetails,
    index
  }
}

export function removeUserNotebook (index) {
  return {
    type: REMOVE_USER_NOTEBOOK,
    index
  }
}