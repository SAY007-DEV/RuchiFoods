import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Dashboard from './Components/Dashboard'
import Sidebar from './Components/Sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Sidebar/>
    </>
  )
}

export default App
