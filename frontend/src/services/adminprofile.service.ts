// adminprofile.service.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.ts';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token globally (optional fallback)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log("token", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
    }
    return Promise.reject(err);
  }
);

class AdminService {
  // ✅ GET OpenAI Key (with token from localStorage)
  async getOpenAIKey() {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/admin/get', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // ✅ PUT/UPSERT OpenAI Key (with token from localStorage)
  async upsertOpenAIKey(openaikey: string) {
    try {
      const token = localStorage.getItem('token');
      const res = await api.put(
        '/admin/update',
        { openaikey },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  // ✅ (Optional) Decode user role from token
  getUserRole(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role || null;
    } catch {
      return null;
    }
  }
}

// ✅ Export instance and methods
const adminService = new AdminService();
export default adminService;
export const { getOpenAIKey, upsertOpenAIKey } = adminService;
