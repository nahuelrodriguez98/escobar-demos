import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import axios from "axios"
import { BrowserRouter } from 'react-router-dom'
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
