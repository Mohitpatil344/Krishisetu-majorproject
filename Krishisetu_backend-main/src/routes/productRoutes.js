// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getMyProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  getDashboardStats
} = require('../controllers/productController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products (both roles can view)
// @access  Private
router.get('/', authenticateToken, getAllProducts);

// @route   GET /api/products/my-products
// @desc    Get farmer's own products
// @access  Private (Farmer only)
router.get('/my-products', authenticateToken, checkRole(['farmer']), getMyProducts);

// @route   GET /api/products/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', authenticateToken, getDashboardStats);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Private
router.get('/:id', authenticateToken, getProductById);

// @route   POST /api/products
// @desc    Add new product
// @access  Private (Farmer only)
router.post('/', authenticateToken, checkRole(['farmer']), addProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Farmer only - own products)
router.put('/:id', authenticateToken, checkRole(['farmer']), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Farmer only - own products)
router.delete('/:id', authenticateToken, checkRole(['farmer']), deleteProduct);

module.exports = router;
