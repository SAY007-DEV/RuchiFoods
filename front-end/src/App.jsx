import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Components/Dashboard'
import Sidebar from './Components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Invoices from './Pages/Invoices'
import ProductManager from './Pages/ProductManager'

function App() {
 

  return (
    <>
      <Sidebar/>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path='/invoices' element={<Invoices/>}></Route>
        <Route path='/products' element={<ProductManager/>}></Route>
      </Routes>
    </>
  )
}

export default App
