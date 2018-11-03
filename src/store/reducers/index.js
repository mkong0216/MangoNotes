import { combineReducers } from 'redux'
import user from './user'
import notebooks from './notebooks'

const reducers = combineReducers({
    user,
    notebooks
})

export default reducers
