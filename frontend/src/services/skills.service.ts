import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Replace with deployed URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class SkillsService {
  // ✅ Create a skill
  async createSkill(skillData : any) {
    try {
      const response = await api.post('/skills', skillData);
      return {
        success: true,
        data: response.data,
        message: 'Skill created successfully',
      };
    } catch (error : any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create skill',
        error: error.response?.data,
      };
    }
  }

  // ✅ Get all skills
  async getAllSkills() {
    try {
      const response = await api.get('/skills');
      return {
        success: true,
        data: response.data,
        message: 'Skills fetched successfully',
      };
    } catch (error : any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch skills',
        error: error.response?.data,
      };
    }
  }

  // ✅ Get skill by ID
  async getSkillById(id : number) {
    try {
      const response = await api.get(`/skills/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Skill fetched successfully',
      };
    } catch (error : any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch skill',
        error: error.response?.data,
      };
    }
  }

  // ✅ Update skill
  async updateSkill(id : number, skillData: any) {
    try {
      const response = await api.put(`/skills/${id}`, skillData);
      return {
        success: true,
        data: response.data,
        message: 'Skill updated successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update skill',
        error: error.response?.data,
      };
    }
  }

  // ✅ Delete skill
  async deleteSkill(id: number) {
    try {
      const response = await api.delete(`/skills/${id}`);
      return {
        success: true,
        data: response.data,
        message: 'Skill deleted successfully',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete skill',
        error: error.response?.data,
      };
    }
  }
}

const skillsService = new SkillsService();
export default skillsService;
