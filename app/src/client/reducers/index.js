import { combineReducers } from 'redux'
import counter from './counter'
import { apiReducer } from './apiCalls'

const dashboardApp = combineReducers({
  counter,
  apiReducer
})

export default dashboardApp
