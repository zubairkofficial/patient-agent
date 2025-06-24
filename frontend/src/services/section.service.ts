 import axios from "axios";
import { API_BASE_URL } from "../utils/constants.ts";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class SectionService {
  // ✅ Create a section (admin only)
  async createSection(sectionData: any) {
    try {
      const response = await api.post("/section/", sectionData);
      return {
        success: true,
        data: response.data,
        message: "Section created successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create section",
        error: error.response?.data,
      };
    }
  }

  async getSectionById(id: number) {
    try {
      const response = await api.get(`/section/${id}/section`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch skills",
      };
    }
  }

  // ✅ Get all sections
  async getAllSections() {
    try {
      const response = await api.get("/section/");
      return {
        success: true,
        data: response.data,
        message: "Sections fetched successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch sections",
        error: error.response?.data,
      };
    }
  }

  // ✅ Update a section (admin only)
  async updateSection(id: number, sectionData: any) {
    try {
      const response = await api.put(`/section/${id}`, sectionData);
      return {
        success: true,
        data: response.data,
        message: "Section updated successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update section",
        error: error.response?.data,
      };
    }
  }

  // ✅ Delete a section (admin only)
  async deleteSection(id: number) {
    try {
      const response = await api.delete(`/section/${id}`);
      return {
        success: true,
        data: response.data,
        message: "Section deleted successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete section",
        error: error.response?.data,
      };
    }
  }
}

const sectionService = new SectionService();
export default sectionService;
