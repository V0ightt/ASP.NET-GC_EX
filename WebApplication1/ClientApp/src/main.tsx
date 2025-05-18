import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'          // bootstrap
import 'react-toastify/dist/ReactToastify.css'          // toasts
import { ToastContainer } from 'react-toastify'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <>
        <App />
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </>
)
