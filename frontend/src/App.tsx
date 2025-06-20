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
        <Route path="/signup" element={<RegisterForm />} />        {/* Protected routes */}        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/statements" element={<StatementsPage />} />
        <Route path="/apikey" element={<AdminKeyPage />} />
        <Route path="/emotions" element={<EmotionsPage />} />
        <Route path="/sections" element={<SectionsPage />} />
        <Route path="/skills" element={<SkillsPage />} />

        {/* Default redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
