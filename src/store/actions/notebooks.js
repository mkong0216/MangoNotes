import { CREATE_NEW_NOTEBOOK, SET_USER_NOTEBOOKS } from './index'

export function createNewNotebook (notebookDetails) {
  return {
    type: CREATE_NEW_NOTEBOOK,
    notebookDetails
  }
}

export function setUserNotebooks (notebooks) {
  return {
    type: SET_USER_NOTEBOOKS,
    notebooks
  }
}