const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner (farmer) is required']
  },
  cropType: {
    type: String,
    required: [true, 'Please specify the crop type']
  },
  wasteType: {
    type: String,
    required: [true, 'Please specify the waste type'],
    enum: ['straw', 'husk', 'leaves', 'stalks', 'other']
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify the quantity']
  },
  unit: {
    type: String,
    required: [true, 'Please specify the unit'],
    enum: ['kg', 'ton', 'quintal']
  },
  price: {
    type: Number,
    required: [true, 'Please specify the price per unit']
  },
  availableFrom: {
    type: Date,
    required: [true, 'Please specify availability date']
  },
  location: {
    address: String,
    district: String,
    state: String,
    pincode: {
      type: String,
      required: [true, 'Please specify the pincode']
    }
  },
  images: [String],
  status: {
    type: String,
    enum: ['available', 'booked', 'sold', 'cancelled'],
    default: 'available'
  },
  description: String
}, {
  timestamps: true
});

// Add compound text index for searching
wasteSchema.index({
  cropType: 'text',
  description: 'text',
  'location.district': 'text',
  'location.state': 'text',
  wasteType: 'text'
});

// Add regular indexes for common query fields
wasteSchema.index({ status: 1 });
wasteSchema.index({ 'location.pincode': 1 });
wasteSchema.index({ availableFrom: 1 });
const Waste = mongoose.model('Waste', wasteSchema);

module.exports = Waste;
