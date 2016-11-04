import { combineReducers } from 'redux'
import counter from './counter'
import { apiReducer } from './apiCalls'
import { viz } from './viz'

const dashboardApp = combineReducers({
  counter,
  apiReducer
})

export default dashboardApp
