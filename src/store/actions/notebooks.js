import { CREATE_NEW_NOTEBOOK } from './index'

export function createNewNotebook (notebookDetails) {
  return {
    type: CREATE_NEW_NOTEBOOK,
    notebookDetails
  }
}