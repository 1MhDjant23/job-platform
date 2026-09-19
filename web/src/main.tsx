import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes }  from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/auth/AuthProvider.tsx'
import { ProtectedRoute } from './components/auth/ProtectedRoute.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
          <ProtectedRoute allowedRoles='ADMIN'>
            <Routes>

              <Route path='/home' element={ <h1>home</h1> }/>
              <Route path='/login' element={<h1>Login</h1>} />
            </Routes>
          </ProtectedRoute>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
