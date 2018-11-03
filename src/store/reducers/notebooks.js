import { CREATE_NEW_NOTEBOOK } from '../actions'

const initialState = {
  userNotebooks: [],
  sharedNotebooks: []
}

const notebooks = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NEW_NOTEBOOK:
      return {
        ...state,
        userNotebooks: [...state.userNotebooks, action.notebookDetails]
      }
    default:
      return state
  }
}

export default notebooks