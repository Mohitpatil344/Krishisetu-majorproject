// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../db/models/User');

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register user
const register = async (req, res) => {
  try {
    const { role, name, email, password, phone, location } = req.body;

    // Validate input
    if (!role || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    if (!['farmer', 'business'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either farmer or business'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      phone,
      location
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    // Validate input
    if (!role || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Role, email and password are required'
      });
    }

    if (!['farmer', 'business'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either farmer or business'
      });
    }

    // Find user with matching role
    const user = await User.findOne({
      email: email.toLowerCase(),
      role: role
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or role mismatch'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
