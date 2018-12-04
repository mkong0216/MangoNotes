import {
  ADD_USER_NOTEBOOK,
  SET_USER_NOTEBOOKS,
  UPDATE_USER_NOTEBOOK,
  REMOVE_USER_NOTEBOOK
} from '../actions'

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
    case ADD_USER_NOTEBOOK:
      return {
        ...state,
        userNotebooks: [...state.userNotebooks, action.noteDetails]
      }
    case UPDATE_USER_NOTEBOOK:
      return {
        ...state,
        userNotebooks: [
          ...state.userNotebooks.slice(0, action.index),
          action.noteDetails, 
          ...state.userNotebooks.slice(action.index + 1)
        ]
      }
    case REMOVE_USER_NOTEBOOK:
      return {
        ...state,
        userNotebooks: [
          ...state.userNotebooks.slice(0, action.index),
          ...state.userNotebooks.slice(action.index + 1)
        ]
      }
    default:
      return state
  }
}

export default notebooks