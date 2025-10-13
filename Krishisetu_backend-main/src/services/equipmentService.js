import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Equipment Service
const equipmentService = {
  // Get all equipment (available to both farmers and businesses)
  getAllEquipment: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.location) params.append('location', filters.location);
      if (filters.leaseDuration) params.append('leaseDuration', filters.leaseDuration);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/equipment?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch equipment' };
    }
  },

  // Get business's own equipment (business only)
  getMyEquipment: async () => {
    try {
      const response = await api.get('/equipment/my-equipment');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch your equipment' };
    }
  },

  // Get single equipment by ID
  getEquipmentById: async (id) => {
    try {
      const response = await api.get(`/equipment/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch equipment details' };
    }
  },

  // Add new equipment (business only)
  addEquipment: async (equipmentData) => {
    try {
      const response = await api.post('/equipment', equipmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add equipment' };
    }
  },

  // Update equipment (business only)
  updateEquipment: async (id, equipmentData) => {
    try {
      const response = await api.put(`/equipment/${id}`, equipmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update equipment' };
    }
  },

  // Delete equipment (business only)
  deleteEquipment: async (id) => {
    try {
      const response = await api.delete(`/equipment/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete equipment' };
    }
  },

  // Get equipment statistics
  getEquipmentStats: async () => {
    try {
      const response = await api.get('/equipment/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch statistics' };
    }
  },
};

export default equipmentService;