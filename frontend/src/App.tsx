import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from './components/auth/auth-layout'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import VerificationCodePage from './pages/auth/verify-code'
import DashboardPage from './pages/dashboard'
import StatementsPage from './pages/statements'
import EmotionsPage from './pages/emotions'
import RegisterForm from './components/auth/register-form'
import SectionsPage from './pages/sections'
import SkillsPage from './pages/skills'
import AdminKeyPage from './pages/apikey'

// ✅ Dummy auth service (replace this with real implementation)
const isAuthenticated = () => {
  return !!localStorage.getItem('token') // Or use your authService.getToken()
}

// ✅ Protected Route wrapper
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
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
        <Route path="/signup" element={<RegisterForm />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/statements"
          element={
            <PrivateRoute>
              <StatementsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/apikey"
          element={
            <PrivateRoute>
              <AdminKeyPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/emotions"
          element={
            <PrivateRoute>
              <EmotionsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/sections"
          element={
            <PrivateRoute>
              <SectionsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/skills"
          element={
            <PrivateRoute>
              <SkillsPage />
            </PrivateRoute>
          }
        />

        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
