import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

let widgetDivs = document.querySelectorAll('.performance-widget');

widgetDivs.forEach((div) => {
  createRoot(div!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
