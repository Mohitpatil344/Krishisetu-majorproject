import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Phone, MapPin, Ruler, Scale, Wheat,
  Tractor, Leaf, CircleDollarSign, TreePine
} from 'lucide-react';

const FarmerRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const selectedRole = location.state?.selectedRole || 'farmer';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phoneNo: '',
    location: '',
    farmSize: '',
    primaryCrops: '',
    farmAddress: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const farmTypes = [
    "Organic Farm",
    "Traditional Farm",
    "Mixed Farming",
    "Sustainable Agriculture"
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          phone: formData.phoneNo,
          location: formData.location,
          farmDetails: {
            location: formData.location,
            farmSize: formData.farmSize,
            primaryCrops: formData.primaryCrops.split(',').map(crop => crop.trim()),
            address: formData.farmAddress,
            farmType: formData.farmType || 'Traditional Farm'
          },
          isVerified: false
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setOtpSent(true);
      alert('OTP sent to your email. Please check and enter it below.');
    } catch (err) {
      console.error('Send OTP error:', err);
      alert(err.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert('Enter OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      // store token and user
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_data', JSON.stringify(data.data.user));

      // Redirect to dashboard
      navigate(data.data.user.role === 'farmer' ? '/farmerDashboard' : '/businessDashboard');
    } catch (err) {
      console.error('Verify OTP error:', err);
      alert(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Resend failed');
      alert('OTP resent to your email');
    } catch (err) {
      console.error('Resend OTP error:', err);
      alert(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-2 bg-green-100 rounded-full mb-4">
            <Leaf className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Welcome to Agricultural Waste Management
          </h1>
          <p className="text-green-700/80 max-w-2xl mx-auto text-lg">
            Join our network of sustainable farmers and contribute to a greener future
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-green-100 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <h2 className="text-2xl font-semibold">{selectedRole} Registration</h2>
            <p className="text-green-50">Complete your profile to get started</p>
          </div>

          <form className="p-8" onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Farm Information Section */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Tractor className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Farm Information</h3>
                </div>
              </div>

              {/* Authentication Details */}
              <motion.div className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <TreePine className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-800">Account Information</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: '' });
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label className="block text-gray-700 font-medium mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrors({ ...errors, password: '' });
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      placeholder="Create a password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setErrors({ ...errors, confirmPassword: '' });
                      }}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Details */}
              <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300"
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </motion.div>

              <motion.div className="form-group" whileHover={{ scale: 1.01 }}>
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all duration-300"
                    placeholder="State, Country"
                  />
                </div>
              </motion.div>

              {/* Farm Details */}
              <motion.div className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <TreePine className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-800">Farm Details</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label className="block text-gray-700 font-medium mb-2">Farm Size (acres)</label>
                    <div className="relative">
                      <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="farmSize"
                        value={formData.farmSize}
                        onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                        placeholder="Enter farm size"
                      />
                    </div>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.01 }}>
                    <label className="block text-gray-700 font-medium mb-2">Farm Type</label>
                    <div className="relative">
                      <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="farmType"
                        onChange={(e) => setFormData({ ...formData, farmType: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none appearance-none bg-white"
                      >
                        <option value="">Select farm type</option>
                        {farmTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Primary Crops */}
              <motion.div className="md:col-span-2" whileHover={{ scale: 1.01 }}>
                <label className="block text-gray-700 font-medium mb-2">Primary Crops</label>
                <div className="relative">
                  <Wheat className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="primaryCrops"
                    value={formData.primaryCrops}
                    onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    placeholder="Enter crops (comma separated)"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">Example: Rice, Wheat, Sugarcane</p>
              </motion.div>

              {/* Farm Address */}
              <motion.div className="md:col-span-2" whileHover={{ scale: 1.01 }}>
                <label className="block text-gray-700 font-medium mb-2">Farm Address</label>
                <textarea
                  name="farmAddress"
                  value={formData.farmAddress}
                  onChange={(e) => setFormData({ ...formData, farmAddress: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                  placeholder="Enter complete farm address"
                />
              </motion.div>
            </div>

            {/* OTP Flow Buttons */}
            {!otpSent ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className={`mt-8 w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                onClick={handleSendOTP}
                disabled={isSubmitting}
              >
                <CircleDollarSign className="w-5 h-5" />
                Send OTP & Register
              </motion.button>
            ) : (
              <div className="mt-8 flex flex-col gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
                    placeholder="Enter OTP received on email"
                  />
                </div>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className={`w-1/2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleVerifyOTP}
                    disabled={isSubmitting || !otp}
                  >
                    Verify OTP
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="w-1/2 py-3 bg-gradient-to-r from-emerald-600 to-green-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                    onClick={handleResendOTP}
                    disabled={isSubmitting}
                  >
                    Resend OTP
                  </motion.button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FarmerRegistration;
