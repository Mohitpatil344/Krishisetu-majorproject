import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Edit2 } from 'lucide-react';

const FarmerWasteCard = ({ waste, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full capitalize">
            {waste.wasteType}
          </span>
          <h3 className="font-semibold text-gray-800 mt-2">{waste.cropType}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-lg text-xs ${
            waste.status === 'available' ? 'bg-green-100 text-green-700' :
            waste.status === 'booked' ? 'bg-yellow-100 text-yellow-700' :
            waste.status === 'sold' ? 'bg-blue-100 text-blue-700' :
            'bg-red-100 text-red-700'
          } capitalize`}>
            {waste.status}
          </span>
          {onEdit && (
            <button
              onClick={() => onEdit(waste)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Quantity</span>
          <span className="font-medium">{waste.quantity} {waste.unit}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-600">Price</span>
          <span className="font-medium text-green-600">₹{waste.price}/{waste.unit}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Available From</span>
          <span className="font-medium">{new Date(waste.availableFrom).toLocaleDateString()}</span>
        </div>
      </div>

      {waste.description && (
        <p className="mt-4 text-sm text-gray-600 italic">"{waste.description}"</p>
      )}

      {waste.location && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
            <div>
              <p className="text-sm text-gray-600">{waste.location.district}, {waste.location.state}</p>
              <p className="text-xs text-gray-500">PIN: {waste.location.pincode}</p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FarmerWasteCard;


