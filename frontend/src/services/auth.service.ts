// services/authService.js
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.ts'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in headers
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');

      // ❌ Don't reload — just reject
      // ✅ Let frontend handle redirect
    }
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

class AuthService {
  getUser() {
    throw new Error('Method not implemented.');
  }
  // Register user
  async register(userData : any) {
    try {
      const response = await api.post('/auth/register', userData);
      return {
        success: true,
        data: response.data,
        message: 'Registration successful',
      };
    } catch (error) {
      const err = error as any;
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
        error: err.response?.data,
      };
    }
  }

  // Login user
async login(credentials: { email: string; password: string }) {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        data: response.data,
        message: 'Login successful',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data,
      };
    }
  }

  // Verify email
  async verifyEmail(verificationData : any) {
    try {
      const response = await api.post('/auth/verify-email', verificationData);
      return {
        success: true,
        data: response.data,
        message: 'Email verified successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Email verification failed',
        error: error.response?.data,
      };
    }
  }

  // Forgot password
  async forgotPassword(email : any) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return {
        success: true,
        data: response.data,
        message: 'Password reset email sent',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send reset email',
        error: error.response?.data,
      };
    }
  }

  // Reset password
  async resetPassword(resetData : any) {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return {
        success: true,
        data: response.data,
        message: 'Password reset successful',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Password reset failed',
        error: error.response?.data,
      };
    }
  }

  // Generate OTP
  async generateOtp(email : any) {
    try {
      const response = await api.post('/auth/generate-otp', { email });
      return {
        success: true,
        data: response.data,
        message: 'OTP sent successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to send OTP',
        error: error.response?.data,
      };
    }
  }

  // Verify OTP
  async verifyOtp(otpData : any) {
    try {
      const response = await api.post('/auth/verify-otp', otpData);
      return {
        success: true,
        data: response.data,
        message: 'OTP verified successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'OTP verification failed',
        error: error.response?.data,
      };
    }
  }

  // Get user profile (protected route)
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return {
        success: true,
        data: response.data,
        message: 'Profile fetched successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile',
        error: error.response?.data,
      };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;

// Optional: Export individual methods if needed
export const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  generateOtp,
  verifyOtp,
  getProfile,
  logout,
  isAuthenticated,
  getCurrentUser,
  getToken
} = authService;