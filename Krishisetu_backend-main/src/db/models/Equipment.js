// db/models/Equipment.js
const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessName: String,
  businessLocation: String,
  businessPhone: String,
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true
  },
  details: {
    type: String,
    trim: true,
    maxlength: [1000, 'Details cannot exceed 1000 characters']
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  leaseDuration: {
    type: String,
    required: [true, 'Lease duration is required'],
    enum: ['Hourly', 'Daily', 'Weekly', 'Monthly']
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1581093588401-22b8d2f94d1f'
  },
  availability: {
    type: String,
    enum: ['Available', 'Unavailable'],
    default: 'Available'
  },
  availableFrom: {
    type: Date
  },
  availableTo: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
equipmentSchema.index({ businessId: 1, availability: 1 });
equipmentSchema.index({ location: 1 });
equipmentSchema.index({ leaseDuration: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);