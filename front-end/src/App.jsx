import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Components/Dashboard'
import Sidebar from './Components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Invoices from './Pages/Invoices'

function App() {
 

  return (
    <>
      <Sidebar/>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path='/invoice' element={<Invoices/>}></Route>
      </Routes>
    </>
  )
}

export default App
