// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBooking,
  getRenterBookings,
  getBusinessBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { authenticateToken } = require('../middleware/auth');
const checkRole = require('../middleware/roleMiddleware');

// Allow both farmers and business users to create bookings
router.post('/', authenticateToken, checkRole(['farmer', 'business']), createBooking);

// Get renter's bookings (exclusively for farmers if needed)
router.get('/my-bookings', authenticateToken, checkRole(['farmer', 'business']), getRenterBookings);

// Get business bookings (for business users)
router.get('/business', authenticateToken, checkRole(['business']), getBusinessBookings);

// Get single booking
router.get('/:id', authenticateToken, getBookingById);

// Update booking status (for business users)
router.patch('/:id/status', authenticateToken, checkRole(['business']), updateBookingStatus);

// Cancel booking (for farmers)
router.patch('/:id/cancel', authenticateToken, checkRole(['farmer']), cancelBooking);

module.exports = router;