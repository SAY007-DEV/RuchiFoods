import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import InvoiceProvider from './context/InvoiceContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <InvoiceProvider>
        <App />
      </InvoiceProvider>
    </BrowserRouter>
  </StrictMode>,
)
