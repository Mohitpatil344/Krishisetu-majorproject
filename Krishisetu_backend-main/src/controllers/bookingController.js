// controllers/bookingController.js
const Booking = require('../db/models/Booking');
const Equipment = require('../db/models/Equipment');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      equipmentId,
      startDate,
      endDate,
      totalDays,
      pricePerDay,
      selectedDuration,
      deliveryMethod,
      deliveryAddress,
      additionalNotes,
    } = req.body;

    // Validate required fields
    if (
      !equipmentId ||
      !startDate ||
      !endDate ||
      !totalDays ||
      !pricePerDay ||
      !selectedDuration ||
      !deliveryMethod
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields',
      });
    }

    // Validate delivery address if delivery is selected
    if (deliveryMethod === 'delivery' && !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address is required for home delivery',
      });
    }

    // Get equipment to find businessId and other details
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found',
      });
    }

    // Calculate total amount based on duration
    let calculatedPrice = 0;
    if (selectedDuration === 'daily') {
      calculatedPrice = pricePerDay * totalDays;
    } else if (selectedDuration === 'weekly') {
      calculatedPrice = (pricePerDay * 7) / 6 * totalDays;
    } else if (selectedDuration === 'monthly') {
      calculatedPrice = (pricePerDay * 30) / 25 * totalDays;
    }

    // Calculate delivery fee
    const deliveryFee = deliveryMethod === 'delivery' ? 500 : 0;
    const totalAmount = calculatedPrice + deliveryFee;

    // Create booking with all required fields
    const booking = new Booking({
      equipmentId,
      equipmentName: equipment.name,
      equipmentBrand: equipment.brand,
      businessId: equipment.businessId,
      renterId: req.user.id,
      startDate,
      endDate,
      totalDays,
      pricePerDay,
      selectedDuration,
      deliveryMethod,
      deliveryAddress: deliveryAddress || '',
      deliveryFee,
      totalAmount,
      additionalNotes: additionalNotes || '',
      status: 'pending',
    });

    await booking.save();

    // Populate equipment and renter details before sending response
    await booking.populate('equipmentId');
    await booking.populate('renterId', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking },
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
    });
  }
};

// Get renter's bookings
exports.getRenterBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ renterId: req.user.id })
      .populate('equipmentId')
      .populate('businessId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { bookings },
      count: bookings.length,
    });
  } catch (error) {
    console.error('Get renter bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

// Get business bookings
exports.getBusinessBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ businessId: req.user.id })
      .populate('equipmentId')
      .populate('renterId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { bookings },
      count: bookings.length,
    });
  } catch (error) {
    console.error('Get business bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};

// Get single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('equipmentId')
      .populate('renterId', 'name email phone location')
      .populate('businessId', 'name email phone location');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (
      booking.renterId._id.toString() !== req.user.id.toString() &&
      booking.businessId._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
      });
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking',
      error: error.message,
    });
  }
};

// Update booking status (business only)
// Update booking status (business or renter)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected', 'confirmed', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is either the business or the renter
    const isBusiness = booking.businessId.toString() === req.user.id.toString();
    const isRenter = booking.renterId.toString() === req.user.id.toString();

    if (!isBusiness && !isRenter) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this booking',
      });
    }

    // Optional: you can restrict which roles can set which status
    // For example, only business can confirm/completed, renter can approve/reject pending requests

    // Update status
    booking.status = status;

    // Save rejection reason if provided
    if (status === 'rejected' && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    await booking.save();

    // Populate details before sending response
    await booking.populate('equipmentId');
    await booking.populate('renterId', 'name email phone location');
    await booking.populate('businessId', 'name email phone location');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      data: { booking },
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message,
    });
  }
};

// Cancel booking (renter only)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if user is renter
    if (booking.renterId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this booking',
      });
    }

    // Check if booking is already cancelled or completed
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed booking',
      });
    }

    // Check if booking can be cancelled (24 hours before start)
    const startDate = new Date(booking.startDate);
    const now = new Date();
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking within 24 hours of start date',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Populate details before sending response
    await booking.populate('equipmentId');
    await booking.populate('businessId', 'name email phone location');

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking },
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};