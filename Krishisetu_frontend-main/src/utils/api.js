// Base API URL
const API_URL = 'http://localhost:5000/api';

// Helper to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

// Helper to check if token exists
const isAuthenticated = () => !!getAuthToken();

// Generic fetch wrapper with auth header
const authenticatedFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    }
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  });

  // Parse JSON response
  const data = await response.json();

  // If response is not ok, throw error with message
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// Simulate API delay for better UX
const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API calls - Real backend integration
export const auth = {
  // Check if email exists for a specific role
  checkEmail: async (role, email) => {
    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role, email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to check email');
      }

      return data;
    } catch (error) {
      console.error('Check email error:', error);
      throw new Error(error.message || 'Failed to check email');
    }
  },

  // Send OTP to email
  sendOtp: async (email) => {
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error(error.message || 'Failed to send OTP');
    }
  },

  // Verify OTP
  verifyOtp: async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }

      return data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error(error.message || 'Failed to verify OTP');
    }
  },

  // Register user
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login user
  loginUser: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }
};

// Legacy API calls (keeping for backward compatibility)
export const legacyAuth = {
  register: (userData) => 
    authenticatedFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (credentials) => 
    authenticatedFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getProfile: () => 
    authenticatedFetch('/auth/me')
};

// User-related API calls
export const users = {
  updateProfile: (data) =>
    authenticatedFetch('/v1/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  verifyUser: (auth0Id) =>
    authenticatedFetch('/v1/users/verify', {
      method: 'POST',
      body: JSON.stringify({ auth0Id })
    })
};

// Waste management API calls
export const waste = {
  list: (filters = {}) =>
    authenticatedFetch('/v1/waste?' + new URLSearchParams(filters)),
    
  create: (data) =>
    authenticatedFetch('/v1/waste', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
  update: (id, data) =>
    authenticatedFetch(`/v1/waste/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    
  delete: (id) =>
    authenticatedFetch(`/v1/waste/${id}`, {
      method: 'DELETE'
    })
};

export { isAuthenticated, getAuthToken };