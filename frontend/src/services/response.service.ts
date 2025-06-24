// src/services/response.service.ts
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ResponseService {
  async createResponse(data: {
    statementId: number;
    userResponse: string;
    botRemarks: string;
    rating: number;
    doctorId?: number;
  }) {
    try {
      const res = await api.post('/responses/create', data);
      return {
        success: true,
        data: res.data,
        message: 'Response created successfully',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create response',
        error: err.response?.data,
      };
    }
  }

  async getResponsesByDoctorId(doctorId: number) {
    try {
      const res = await api.get(`/responses/doctor/${doctorId}`);
      return {
        success: true,
        data: res.data,
        message: 'Responses fetched successfully',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch responses',
        error: err.response?.data,
      };
    }
  }
}

const responseService = new ResponseService();
export default responseService;
