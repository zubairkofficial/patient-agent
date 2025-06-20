import axios from "axios";
import authService from "./auth.service";
import { API_BASE_URL } from "../utils/constants.ts";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    }
    return Promise.reject(err);
  }
);

class AdminService {
  private isAdmin(): boolean {
    try {
      const user: any = authService.getUser();
      return user?.role === "admin"; // adjust if your enum is 'ADMIN'
    } catch {
      return false;
    }
  }

  // ✅ GET OpenAI Key
  async getOpenAIKey() {
    if (!this.isAdmin()) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }

    try {
      const res = await api.get("/admin/profile/get");
      return {
        success: true,
        data: res.data,
        message: "Key fetched successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch key",
        error: error.response?.data,
      };
    }
  }

  // ✅ PUT OpenAI Key
  async upsertOpenAIKey(openaikey: string) {
    if (!this.isAdmin()) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }

    try {
      const res = await api.put("/admin/profile/update", { openaikey });
      return {
        success: true,
        data: res.data,
        message: "Key updated successfully",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update key",
        error: error.response?.data,
      };
    }
  }
}

// ✅ Export instance and methods
const adminService = new AdminService();
export default adminService;
export const { getOpenAIKey, upsertOpenAIKey } = adminService;
