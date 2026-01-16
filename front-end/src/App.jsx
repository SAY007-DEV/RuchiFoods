import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Components/Dashboard'
import Sidebar from './Components/Sidebar'
import { Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Sidebar/>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

export default App
