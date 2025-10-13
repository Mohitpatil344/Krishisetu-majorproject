import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { useAuth } from '../contexts/AuthContext'; // Import AuthContext

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { selectedRole, clearRole, setSelectedRole } = useRole();
  const { setAuthData } = useAuth(); // Use setAuthData instead of login

  // Redirect if no role selected
  useEffect(() => {
    if (!selectedRole) {
      navigate('/role-selection');
    } else if (location.state?.selectedRole && location.state.selectedRole !== selectedRole) {
      // Update context if role comes from location state
      setSelectedRole(location.state.selectedRole);
    }
  }, [selectedRole, navigate, location.state, setSelectedRole]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: selectedRole,
        }),
        credentials: 'include', // Add this to handle cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Update auth context with token and user data
      setAuthData(data.data.token, data.data.user);

      // Navigate based on role
      if (selectedRole === 'farmer') {
        navigate('/farmerDashboard', { replace: true });
      } else {
        navigate('/businessDashboard', { replace: true });
      }

    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Now this is OUTSIDE handleSubmit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBackToRoleSelection = () => {
    clearRole();
    navigate('/role-selection');
  };


  if (!selectedRole) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <button
          onClick={handleBackToRoleSelection}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Role Selection
        </button>

        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
              {selectedRole === 'farmer' ? '👨‍🌾' : '🏢'}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Sign in as {selectedRole === 'farmer' ? 'Farmer' : 'Business'}
            </h1>
            <p className="text-gray-600">Welcome back! Please sign in to your account</p>
          </div>

          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {loginError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                  } focus:ring-2 focus:outline-none`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 rounded-lg border-2 transition-colors ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-green-500 focus:ring-green-200'
                  } focus:ring-2 focus:outline-none`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              New here?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-medium transition-colors">
                Register now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;