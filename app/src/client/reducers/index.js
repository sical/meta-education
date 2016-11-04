import { combineReducers } from 'redux'
import counter from './counter'

const dashboardApp = combineReducers({
  counter
})

export default dashboardApp
