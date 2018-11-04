import { combineReducers } from 'redux'
import user from './user'
import notebooks from './notebooks'
import notepages from './notepages'

const reducers = combineReducers({
    user,
    notebooks,
    notepages
})

export default reducers
