import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import reducers from './reducers';
import createLogger from 'redux-logger'

const middlewares = [ ReduxThunk ]
if (process.env.NODE_ENV !== 'production') {
  middlewares.push(createLogger())
}

const store = createStore(
  reducers,
  applyMiddleware(...middlewares)
)

export default store
