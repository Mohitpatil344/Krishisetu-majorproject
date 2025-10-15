// models/Bid.js
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    timestamp: { type: Date, default: Date.now },
    expiry: { type: Date }
});

const Bid = mongoose.model('Bid', bidSchema);

module.exports = Bid;
