// src/contexts/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    console.log('AuthContext: Token on mount:', token);
    if (token) {
      // Fetch user profile when token exists
      console.log('AuthContext: Fetching user profile with token:', token);
      fetchUserProfile();
    } else {
      console.log('AuthContext: No token found, setting loading to false');
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      console.log('AuthContext: Making request to /api/auth/me with token:', token);
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('AuthContext: Response status:', response.status);
      
      if (response.ok) {
        const { data } = await response.json();
        console.log('AuthContext: User data received:', data.user);
        setUser(data.user);
      } else {
        console.log('AuthContext: Token invalid, logging out');
        // If token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error('AuthContext: Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save token and update state
      localStorage.setItem('auth_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token and update state
      localStorage.setItem('auth_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const setAuthData = (token, userData) => {
    console.log('setAuthData called with:', { token, userData });
    localStorage.setItem('auth_token', token);
    setToken(token);
    setUser(userData);
    console.log('User data set:', userData);
  };

  const hasRole = (role) => {
    // Add debugging logs
    console.log('Checking role:', role);
    console.log('Current user:', user);
    console.log('User role:', user?.role);
    return user?.role?.toLowerCase() === role?.toLowerCase();
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    setAuthData,
    hasRole,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}