import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../utils/constants.ts'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to get user role from token
function getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded?.role || null;
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
}

class StatementService {
  getRole() {
    return getUserRole();
  }

  async createStatement(data: any) {
    try {
      const res = await api.post('/', data);
      return {
        success: true,
        data: res.data,
        message: 'Statement created successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create statement',
        error: error.response?.data,
      };
    }
  }

  async getAllStatements() {
    try {
      const res = await api.get('/get');
      return {
        success: true,
        data: res.data,
        message: 'Statements fetched successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statements',
        error: error.response?.data,
      };
    }
  }

  async getStatementById(id: number) {
    try {
      const res = await api.get(`/get/${id}`);
      return {
        success: true,
        data: res.data,
        message: 'Statement fetched successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statement',
        error: error.response?.data,
      };
    }
  }

  async getStatementsBySectionId(sectionId: number) {
    try {
      const res = await api.get(`/section/${sectionId}`);
      return {
        success: true,
        data: res.data,
        message: 'Statements by section fetched successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statements',
        error: error.response?.data,
      };
    }
  }

  async updateStatement(id: number, data: any) {
    try {
      const res = await api.put(`/update/${id}`, data);
      return {
        success: true,
        data: res.data,
        message: 'Statement updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update statement',
        error: error.response?.data,
      };
    }
  }

  async deleteStatement(id: number) {
    try {
      const res = await api.delete(`/delete/${id}`);
      return {
        success: true,
        data: res.data,
        message: 'Statement deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete statement',
        error: error.response?.data,
      };
    }
  }
}

const statementService = new StatementService();
export default statementService;
