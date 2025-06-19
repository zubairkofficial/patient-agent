import axios from 'axios';
import authService from './auth.service';

const API_BASE_URL = 'http://localhost:3000'; // Adjust to match your backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept request to include auth token
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    return Promise.reject(err);
  }
);

class AdminService {
  // ✅ Get existing OpenAI key (admin only)
  async getOpenAIKey() {
    try {
      const res = await api.get('/admin/profile/get');
      return {
        success: true,
        data: res.data,
        message: 'Key fetched successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch key',
        error: error.response?.data,
      };
    }
  }

  // ✅ Upsert (create or update) OpenAI key (admin only)
  async upsertOpenAIKey(openaikey: string) {
    try {
      const res = await api.put('/admin/profile/update', { openaikey });
      return {
        success: true,
        data: res.data,
        message: 'Key updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update key',
        error: error.response?.data,
      };
    }
  }
}

// Export singleton
const adminService = new AdminService();
export default adminService;

// Optionally export functions
export const {
  getOpenAIKey,
  upsertOpenAIKey,
} = adminService;
