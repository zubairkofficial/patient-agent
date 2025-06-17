import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from './components/auth/auth-layout'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import VerificationCodePage from './pages/auth/verify-code'

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          }
        />
        <Route
          path="/verify-code"
          element={
            <AuthLayout>
              <VerificationCodePage />
            </AuthLayout>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}
