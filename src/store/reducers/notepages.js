import { SET_USER_NOTEPAGES, UPDATE_USER_NOTEPAGES } from '../actions'

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
    case UPDATE_USER_NOTEPAGES:
      return {
        ...state,
        userNotepages: [...state.userNotepages, action.noteDetails]
      }
    default:
      return state
  }
}

export default notepages