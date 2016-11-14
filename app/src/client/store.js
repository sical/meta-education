import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import createLogger from 'redux-logger'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

// Apply the middleware to the store
const router = routerMiddleware(browserHistory)

const middlewares = [ ReduxThunk, router ]
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(createLogger())
}

const store = createStore(
  reducers,
  applyMiddleware(...middlewares)
)

export default store
