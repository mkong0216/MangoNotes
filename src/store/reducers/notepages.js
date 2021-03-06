import {
  ADD_USER_NOTEPAGE,
  SET_USER_NOTEPAGES,
  UPDATE_USER_NOTEPAGE,
  REMOVE_USER_NOTEPAGE,
  SET_USER_SHARED,
  CLEAR_USER_NOTEPAGES
} from '../actions'

const initialState = {
  userNotepages: [],
  sharedNotepages: []
}

const notepages = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NOTEPAGES:
      return {
        ...state,
        userNotepages: action.notepages
      }
    case ADD_USER_NOTEPAGE:
      return {
        ...state,
        userNotepages: [...state.userNotepages, action.noteDetails]
      }
    case UPDATE_USER_NOTEPAGE:
      return {
        ...state,
        userNotepages: [
          ...state.userNotepages.slice(0, action.index),
          action.noteDetails,
          ...state.userNotepages.slice(action.index + 1)
        ]
      }
    case SET_USER_SHARED:
      return {
        ...state,
        sharedNotepages: action.notepages
      }
    case REMOVE_USER_NOTEPAGE:
      return {
        ...state,
        userNotepages: [
          ...state.userNotepages.slice(0, action.index),
          ...state.userNotepages.slice(action.index + 1)
        ]
      }
    case CLEAR_USER_NOTEPAGES:
      return initialState
    default:
      return state
  }
}

export default notepages