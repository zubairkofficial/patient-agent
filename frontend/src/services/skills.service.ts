import axios from "axios";
import { API_BASE_URL } from "../utils/constants.ts";

//  const token = localStorage.getItem('token');
// console.log("toke", token)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // 'Authorization' : `Bearer ${token}`
  },
});

// // ✅ Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class SkillsService {
  // ✅ Create a skill (admin only)
  async createSkill(skillData: any) {
    try {
      const response = await api.post("/skills/", skillData);
      return {
        success: true,
        data: response.data,
        message: "Skill created successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create skill",
        error: error.response?.data,
      };
    }
  }

  // ✅ Get all skills (public or user/admin)
  async getAllSkills() {
    try {
      const response = await api.get("/skills/get");
      return {
        success: true,
        data: response.data,
        message: "Skills fetched successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch skills",
        error: error.response?.data,
      };
    }
  }

  // ✅ Get skill by ID
  async getSkillById(id: number) {
    try {
      const response = await api.get(`/skills/get/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Skill fetched successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch skill",
        error: error.response?.data,
      };
    }
  }

  // ✅ Update skill (admin only)
  async updateSkill(id: number, skillData: any) {
    try {
      const response = await api.put(`/skills/update/${id}`, skillData);
      return {
        success: true,
        data: response.data,
        message: "Skill updated successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update skill",
        error: error.response?.data,
      };
    }
  }

  // ✅ Delete skill (admin only)
  async deleteSkill(id: number) {
    try {
      const response = await api.delete(`/skills/delete/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Skill deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete skill",
        error: error.response?.data,
      };
    }
  }
}

const skillsService = new SkillsService();
export default skillsService;
