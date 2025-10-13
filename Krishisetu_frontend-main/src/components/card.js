import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Factory, Crop, Home } from 'lucide-react';
import farmer from '../assets/farmer2.png';
const Card = ({ farmerData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10 z-0" />
      
      {/* Image Section */}
      <div className="w-full h-48 relative">
        <img
          src={farmer}
          alt="Farm"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 p-6 space-y-4">
        {/* Header with gradient border */}
        <div className="pb-4 border-b border-gradient-to-r from-green-300 to-emerald-300">
          <div className="flex items-center space-x-3 mb-2">
            <Phone className="text-green-600 w-5 h-5" />
            <span className="text-gray-700">{farmerData.phone}</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="text-green-600 w-5 h-5" />
            <span className="text-gray-700">{farmerData.location}</span>
          </div>
        </div>

        {/* Farmer Details Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-700">Farmer Details</h3>
          
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-3"
          >
            <Factory className="text-green-600 w-5 h-5" />
            <span className="text-gray-700">Farm Size: {farmerData.farmSize}</span>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-3"
          >
            <Crop className="text-green-600 w-5 h-5" />
            <span className="text-gray-700">Primary Crops: {farmerData.primaryCrops}</span>
          </motion.div>

          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-3"
          >
            <Home className="text-green-600 w-5 h-5" />
            <span className="text-gray-700">Farm Address: {farmerData.farmAddress}</span>
          </motion.div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium shadow-lg hover:shadow-green-500/30 transition-all duration-300"
        >
          Contact Farmer
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Card;
