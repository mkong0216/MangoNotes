import { CREATE_NEW_NOTEBOOK } from '../actions'

const initialState = {
  notebooks = []
}

const notebooks = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_NEW_NOTEBOOK:
      return {
        ...state,
        notebooks: [...state.notebooks, action.notebookDetails]
      }
    default:
      return state
  }
}

export default notebooks