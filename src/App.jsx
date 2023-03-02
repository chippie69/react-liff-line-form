import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/Home"
import Custompaid from "./components/Custompaid"
import Survey from "./components/Survey"

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/custompaid" element={<Custompaid />} />
          <Route path="/survey" element={<Survey />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
