import { UPDATE_EDITOR_STYLES } from '../actions'

const initialState = {
  textColor: '#000',
  activeButtons: {
    fontStyle: [],
    textAlign: 'align left',
    lists: null
  }
}

const editor = (state = initialState, action)  => {
  switch (action.type) {
    case UPDATE_EDITOR_STYLES:
      return {
        ...state,
        [action.name]: action.value
      }
    default:
      return state
  }
}

export default editor
