import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'

import { AuthLayout } from './components/auth/auth-layout'
import LoginPage from './pages/auth/login'
import ForgotPasswordPage from './pages/auth/forgot-password'
import VerificationCodePage from './pages/auth/verify-code'
import RegisterForm from './components/auth/register-form'

import StatementsPage from './admin/Pages/statements'
import EmotionsPage from './admin/Pages/emotions'
import SectionsPage from './admin/Pages/sections'
import SkillsPage from './admin/Pages/skills'
import AdminKeyPage from './admin/Pages/apikey'
import DashboardPage from './admin/Pages/dashboard'
import { DashboardLayout } from './admin/components/layout/dashboard-layout'

import UserLayout from './components/layout/UserLayout'
import UserHome from './pages/user/Home'
import UserProfile from './pages/user/Profile'
import Statements from './pages/user/statement/Statements'
import StatementResponse from './pages/user/statement/statement-response'

// ✅ Dummy auth service (replace with real logic)
const isAuthenticated = () => {
  return !!localStorage.getItem('token') // Or use your authService.getToken()
}

// ✅ Protected Route
const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  return isAuthenticated() ? children : <Navigate to="/" replace />
}

// ✅ Public Route (prevents access if already logged in)
const PublicRoute = ({ children }: { children: React.ReactElement }) => {
  return isAuthenticated() ? <Navigate to="/user/home" replace /> : children
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes (restricted if logged in) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <AuthLayout>
                <ForgotPasswordPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/verify-code"
          element={
            <PublicRoute>
              <AuthLayout>
                <VerificationCodePage />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* ✅ Protected User Routes */}
        <Route
          path="/user"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route path="home" element={<UserHome />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="section/:id" element={<Statements />} />
          <Route path="section/:id/statement/:statementId" element={<StatementResponse />} />
          <Route index element={<UserHome />} />
        </Route>

        {/* ✅ Protected Admin Routes */}
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
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* ✅ Default Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
