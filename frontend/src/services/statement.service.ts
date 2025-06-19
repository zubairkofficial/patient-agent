import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Update to your backend URL if needed

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class StatementService {
  // ✅ Create new statement
  async createStatement(data:any) {
    try {
      const res = await api.post('/statements', data);
      return {
        success: true,
        data: res.data,
        message: 'Statement created successfully',
      };
    } catch (error:any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create statement',
        error: error.response?.data,
      };
    }
  }

  // ✅ Get all statements
  async getAllStatements() {
    try {
      const res = await api.get('/statements');
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

  // ✅ Get statement by ID
  async getStatementById(id: number) {
    try {
      const res = await api.get(`/statements/${id}`);
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

  // ✅ Get statements by section ID
  async getStatementsBySectionId(sectionId: number) {
    try {
      const res = await api.get(`/statements/section/${sectionId}`);
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

  // ✅ Update a statement
  async updateStatement(id: number, data: any) {
    try {
      const res = await api.put(`/statements/${id}`, data);
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

  // ✅ Delete a statement
  async deleteStatement(id: number) {
    try {
      const res = await api.delete(`/statements/${id}`);
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
