import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter }  from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/auth/AuthProvider.tsx'
// import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'
// import { Spinner } from './components/ui/Spinner.tsx'
// import { Button } from './components/ui/Button.tsx'
// import { Input } from './components/ui/Input.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
