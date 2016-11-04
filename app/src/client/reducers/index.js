import { combineReducers } from 'redux'
import counter from './counter'
import { api } from './api'
import { viz } from './viz'

const dashboardApp = combineReducers({
  counter,
  api,
  viz
})

export default dashboardApp
