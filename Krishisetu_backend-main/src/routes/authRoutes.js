// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user (farmer or business)
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user (farmer or business)
// @access  Public
router.post('/login', login);

// ALSO add without /auth prefix for backward compatibility
router.post('/api/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', authenticateToken, getCurrentUser);

module.exports = router;