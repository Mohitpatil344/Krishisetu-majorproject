import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const handleVerify = async () => {
    setError('');
    setIsLoading(true);
    try {
  const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');

      // store token and user
      localStorage.setItem('auth_token', data.data.token);
      localStorage.setItem('user_data', JSON.stringify(data.data.user));

      navigate(data.data.user.role === 'farmer' ? '/farmerDashboard' : '/businessDashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
  const res = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP');
      alert('OTP resent to your email');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
        <p className="mb-4">Enter the 6-digit code sent to <strong>{email}</strong></p>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Enter OTP"
        />
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
        <div className="mt-4 text-center">
          <button onClick={handleResend} className="text-sm text-blue-600 hover:underline">Resend OTP</button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;