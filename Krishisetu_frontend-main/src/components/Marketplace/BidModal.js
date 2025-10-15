import React, { useState } from 'react';
import { X, TrendingUp, Package, MapPin, IndianRupee, AlertCircle, CheckCircle } from 'lucide-react';

const BidModal = ({ listing, onClose, onBidSuccess }) => {
  const [bidPrice, setBidPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Parse available quantity (remove 'kg' text)
  const availableQty = parseInt(listing.quantity.replace(/[^\d]/g, ''));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (parseFloat(quantity) > availableQty) {
      setError(`Quantity cannot exceed ${availableQty} kg available`);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const bidData = {
      listingId: listing.id,
      wasteType: listing.wasteType,
      bidPrice: parseFloat(bidPrice),
      quantity: parseFloat(quantity),
      totalAmount: parseFloat(totalPrice),
      notes,
      timestamp: new Date().toISOString()
    };
    
    console.log('Bid Submitted:', bidData);
    
    setIsSubmitting(false);
    
    // Call success callback if provided
    if (onBidSuccess) {
      onBidSuccess(bidData);
    }
    
    onClose();
  };

  const totalPrice = bidPrice && quantity ? (parseFloat(bidPrice) * parseFloat(quantity)).toFixed(2) : '0.00';
  const isBidValid = bidPrice && parseFloat(bidPrice) >= parseFloat(listing.price);
  const isQuantityValid = quantity && parseFloat(quantity) > 0 && parseFloat(quantity) <= availableQty;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full relative transform transition-all animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-600 to-green-700 rounded-t-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all z-10"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          
          <div className="relative z-10">
            <div className="flex items-center mb-2">
              <div className="bg-white/20 rounded-xl p-2 mr-3">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Place Your Bid</h3>
                <p className="text-green-50 text-sm mt-1">Make a competitive offer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listing Info */}
        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-100">
          <h4 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
            <div className="bg-green-600 rounded-lg p-1.5 mr-2">
              <Package size={16} className="text-white" />
            </div>
            {listing.wasteType}
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-700 bg-white/60 rounded-lg p-2">
              <MapPin size={16} className="mr-2 text-green-600 flex-shrink-0" />
              <span className="font-medium">{listing.location}</span>
            </div>
            <div className="flex items-center text-gray-700 bg-white/60 rounded-lg p-2">
              <Package size={16} className="mr-2 text-green-600 flex-shrink-0" />
              <span className="font-medium">{listing.quantity}</span>
            </div>
            <div className="col-span-2 flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center text-gray-700">
                <TrendingUp size={18} className="mr-2 text-green-600" />
                <span className="font-medium">Current Price:</span>
              </div>
              <span className="text-xl font-bold text-green-700">₹{listing.price}/kg</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Bid Price Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Bid Price (per kg) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                placeholder={`Minimum: ₹${listing.price}`}
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                step="0.01"
                min={listing.price}
                required
              />
            </div>
            {bidPrice && !isBidValid && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Bid must be at least ₹{listing.price}/kg
              </p>
            )}
            {bidPrice && isBidValid && (
              <p className="text-green-600 text-xs mt-2 flex items-center">
                <CheckCircle size={12} className="mr-1" />
                Valid bid amount
              </p>
            )}
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity (kg) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                placeholder={`Max: ${availableQty} kg`}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                step="1"
                min="1"
                max={availableQty}
                required
              />
            </div>
            {quantity && !isQuantityValid && (
              <p className="text-red-500 text-xs mt-2 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Available quantity: {availableQty} kg
              </p>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              placeholder="Special requirements, pickup preferences, payment terms..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
              rows="3"
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">{notes.length}/500</p>
          </div>

          {/* Total Price Display */}
          {bidPrice && quantity && isBidValid && isQuantityValid && (
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-5 text-white shadow-lg animate-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-green-50">Total Bid Amount:</span>
                <span className="text-3xl font-bold">₹{totalPrice}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-green-100 pt-2 border-t border-green-500/30">
                <span>{quantity} kg × ₹{bidPrice}/kg</span>
                <span className="bg-green-500/30 px-3 py-1 rounded-full text-xs font-medium">
                  {((parseFloat(bidPrice) - parseFloat(listing.price)) / parseFloat(listing.price) * 100).toFixed(1)}% above minimum
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isBidValid || !isQuantityValid}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : 'Submit Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;