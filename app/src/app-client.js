// app-client.js
import React from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import createHistory from 'history/createBrowserHistory'
const history = createHistory()

import Home from "./components/Home.jsx"

console.log("youo");
const app = document.getElementById('app')
render(<Home />, app)
