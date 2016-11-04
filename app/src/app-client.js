// app-client.js
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Provider } from 'react-redux'

import store  from './client/store'

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Home from "./client/pages/Home.jsx"
let userId = "31af3b8e-4ac6-4ae1-b651-a64df7b012cd"

const App = () => (
  <MuiThemeProvider>
    <Home userId={userId} />
  </MuiThemeProvider>
);


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
