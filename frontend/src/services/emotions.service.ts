// src/services/emotion.service.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../utils/constants.ts'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Optional: Get role from token (if needed in frontend)
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

// ✅ DTO types
export interface EmotionDto {
  name: string;
  detail?: string;
}

class EmotionService {
  getRole() {
    return getUserRole();
  }

  async createEmotion(data: EmotionDto) {
    try {
      const res = await api.post('/emotions/', data);
      return {
        success: true,
        data: res.data,
        message: 'Emotion created successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create emotion',
        error: error.response?.data,
      };
    }
  }

  async getAllEmotions() {
    try {
      const res = await api.get('/emotions/getall');
      return {
        success: true,
        data: res.data,
        message: 'Emotions fetched successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch emotions',
        error: error.response?.data,
      };
    }
  }

  async getEmotionById(id: number) {
    try {
      const res = await api.get(`/emotions/get/${id}`);
      return {
        success: true,
        data: res.data,
        message: 'Emotion fetched successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch emotion',
        error: error.response?.data,
      };
    }
  }

  async updateEmotion(id: number, data: EmotionDto) {
    try {
      const res = await api.patch(`/emotions/update/${id}`, data);
      return {
        success: true,
        data: res.data,
        message: 'Emotion updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update emotion',
        error: error.response?.data,
      };
    }
  }
  async deleteEmotion(id: number) {
    try {
      const res = await api.delete(`/emotions/delete/${id}`);
      return {
        success: true,
        data: res.data,
        message: 'Emotion deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete emotion',
        error: error.response?.data,
      };
    }
  }
}

const emotionService = new EmotionService();
export default emotionService;
