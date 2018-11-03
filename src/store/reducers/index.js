import { combineReducers } from 'redux'
import user from './user'
import notebook from './notebook'

const reducers = combineReducers({
    user,
    notebook
})

export default reducers
