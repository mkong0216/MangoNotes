import { CREATE_NEW_NOTEPAGE } from '../actions'

const initialState = {
  userNotePages: [],
  sharedNotePages: []
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
        userNotePages: [...state.userNotePages, newNotePage]
      }
    default:
      return state
  }
}

export default notepages