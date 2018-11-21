import { CREATE_NEW_NOTEBOOK, SET_USER_NOTEBOOKS, UPDATE_USER_NOTEBOOKS } from '../actions'

const initialState = {
  userNotebooks: [],
  sharedNotebooks: []
}

const notebooks = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NEW_NOTEBOOK:
      const newNotebook = {
        ...action.notebookDetails,
        timestamp: new Date(),
        notepages: []
      }

      return {
        ...state,
        userNotebooks: [...state.userNotebooks, newNotebook]
      }
    case SET_USER_NOTEBOOKS:
      return {
        ...state,
        userNotebooks: action.notebooks
      }
    case UPDATE_USER_NOTEBOOKS:
      return {
        ...state,
        userNotebooks: [...state.userNotebooks, action.noteDetails]
      }
    default:
      return state
  }
}

export default notebooks