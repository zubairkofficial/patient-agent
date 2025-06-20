import axios from 'axios';
import { API_BASE_URL } from '../utils/constants.ts'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: include token if your backend is protected
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ResponseService {
  // ✅ Create a response
  async createResponse(data : any) {
    try {
      const res = await api.post('/response', data);
      return {
        success: true,
        data: res.data,
        message: 'Response created successfully',
      };
    } catch (err : any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create response',
        error: err.response?.data,
      };
    }
  }

  // ✅ Get responses by doctor ID
  async getResponsesByDoctorId(doctorId : number) {
    try {
      const res = await api.get(`/response/by-doctor/${doctorId}`);
      return {
        success: true,
        data: res.data,
        message: 'Responses fetched successfully',
      };
    } catch (err : any) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to fetch responses',
        error: err.response?.data,
      };
    }
  }
}

// Export as singleton
const responseService = new ResponseService();
export default responseService;
