import { CREATE_NEW_NOTEBOOK } from '../actions'

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
    default:
      return state
  }
}

export default notebooks