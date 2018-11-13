import { CREATE_NEW_NOTEPAGE, SET_USER_NOTEPAGES } from '../actions'

const initialState = {
  userNotepages: [],
  sharedNotepages: []
}

const notepages = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NEW_NOTEPAGE:
      const newNotePage = {
        ...action.notepageDetails,
        timestamp: new Date()
      }

      return {
        ...state,
        userNotepages: [...state.userNotepages, newNotePage]
      }
    case SET_USER_NOTEPAGES:
      return {
        ...state,
        userNotepages: action.notepages
      }
    default:
      return state
  }
}

export default notepages