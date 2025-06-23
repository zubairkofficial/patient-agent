import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import { AuthLayout } from './components/auth/auth-layout'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import VerificationCodePage from './pages/auth/verify-code'
import DashboardPage from './pages/Dashboard/index'
import StatementsPage from './admin/Pages/statements'
import EmotionsPage from './admin/Pages/emotions'
import RegisterForm from './components/auth/register-form'
import SectionsPage from './admin/Pages/sections'
import SkillsPage from './admin/Pages/skills'
import { DashboardLayout } from './admin/components/layout/dashboard-layout'
import AdminKeyPage from './admin/Pages/apikey'
// import userRoutes   from './pages/user/routes';
import UserLayout from './components/layout/UserLayout';
import UserHome from './pages/user/Home';
import UserProfile from './pages/user/Profile';
import UserSettings from './pages/user/Settings';
import Statements from './pages/user/statement/Statements'
import StatementResponse from './pages/user/statement/statement-response'
// ✅ Dummy auth service (replace this with real implementation)
const isAuthenticated = () => {
  return !!localStorage.getItem('token') // Or use your authService.getToken()
}

// ✅ Protected Route wrapper
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
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
        <Route path="/user" element={<UserLayout />}>
          <Route path="home" element={<UserHome />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="settings" element={<UserSettings />} />
          <Route path="section/:id" element={<Statements />} />
          <Route path="section/:id/statement/:statementId" element={<StatementResponse />} />
          <Route index element={<UserHome />} />
        </Route>
        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"
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

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout children={undefined} />
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
