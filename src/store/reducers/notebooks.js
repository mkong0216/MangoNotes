import { SET_USER_NOTEBOOKS, UPDATE_USER_NOTEBOOKS } from '../actions'

const initialState = {
  userNotebooks: [],
  sharedNotebooks: []
}

const notebooks = (state = initialState, action) => {
  switch (action.type) {
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