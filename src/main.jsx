import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import Custompaid from './pages/Custompaid'
import Survey from './pages/Survey'
import Forbidden from './pages/Forbidden'

const router = createBrowserRouter ([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/custompaid",
    element: <Custompaid />
  },
  {
    path: "/survey",
    element: <Survey />
  },
  {
    path: "/forbidden",
    element: <Forbidden />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={ router } />
  </React.StrictMode>,
)
