import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ScrollToTop from "./components/ScrollToTop.jsx";
import { ensureGuestId } from './utils/guest';

ensureGuestId();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <ScrollToTop />
    <App />
  </StrictMode>
  </BrowserRouter>
)
