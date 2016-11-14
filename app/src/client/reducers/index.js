import { combineReducers } from 'redux'
import { api } from './api'
import { viz } from './viz'
import { routerReducer } from 'react-router-redux'

const dashboardApp = combineReducers({
  api,
  viz,
  routing: routerReducer
})

export default dashboardApp
