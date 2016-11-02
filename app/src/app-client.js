// app-client.js
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import createHistory from 'history/createBrowserHistory'
const history = createHistory()

// Needed for onTouchTap
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Dashboard from "./client/pages/Dashboard.jsx"

let userId = "31af3b8e-4ac6-4ae1-b651-a64df7b012cd"

const App = () => (
  <MuiThemeProvider>
    <Dashboard userId={userId} />
  </MuiThemeProvider>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
