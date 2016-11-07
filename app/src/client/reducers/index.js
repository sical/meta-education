import { combineReducers } from 'redux'
import { api } from './api'
import { viz } from './viz'

const dashboardApp = combineReducers({
  api,
  viz
})

export default dashboardApp
