const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: true,
    },
    equipmentName: {
      type: String,
      required: true,
    },
    equipmentBrand: {
      type: String,
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0,
    },
    selectedDuration: {
      type: String,
      enum: ["hourly", "daily", "weekly", "monthly"], // ✅ FIXED: lowercase to match frontend
      default: "daily",
    },
    deliveryMethod: {
      type: String,
      enum: ["delivery", "pickup"], // ✅ FIXED: lowercase, removed duplicate "Self Pickup"
      default: "pickup",
    },
    deliveryAddress: {
      type: String,
      required: function () {
        return this.deliveryMethod === 'delivery'; // ✅ lowercase to match
      },
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    additionalNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Index for efficient queries
bookingSchema.index({ renterId: 1, createdAt: -1 });
bookingSchema.index({ businessId: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);