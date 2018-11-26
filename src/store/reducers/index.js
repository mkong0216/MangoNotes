import { combineReducers } from 'redux'
import user from './user'
import notebooks from './notebooks'
import notepages from './notepages'
import editor from './editor'

const reducers = combineReducers({
    user,
    notebooks,
    notepages,
    editor
})

export default reducers
