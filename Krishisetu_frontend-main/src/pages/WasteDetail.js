import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, TreesIcon, Mail, Calendar, Package, DollarSign, Leaf, Info, Loader2, MessageCircle } from 'lucide-react';

const WasteDetail = () => {
  const { id } = useParams();
  const [wasteData, setWasteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contact, setContact] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWasteDetail = async () => {
      try {
        console.log('Fetching waste detail...');
        const response = await fetch(`https://knowcode-protobuf-backend.vercel.app/api/v1/waste/detail/${id}`);
        const data = await response.json();
        console.log('Received data:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch waste details');
        }

        // Extract the waste details from the nested structure
        setWasteData(data.data.wasteInfo.details);
        setContact(data.data.wasteInfo.farmerContact);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWasteDetail();
  }, [id]);

  const handleWhatsAppContact = () => {
    console.log('contact', contact.phone);

    // Format the message
    const message = `
Hello! I found your listing on AgroWaste Connect.

*Inquiry Details:*
• Product: ${wasteData.wasteType} (${wasteData.cropType})
• Quantity: ${wasteData.quantity} ${wasteData.unit}
• Listed Price: ₹${wasteData.price} per ${wasteData.unit}
• Location: ${wasteData.location.district}, ${wasteData.location.state}

I'm interested in purchasing this agricultural waste from your farm. 
Could you please confirm:
1. Current availability
2. Price confirmation
3. Possible pickup/delivery options

Looking forward to your response.

Reference ID: ${wasteData._id.slice(-6)}
    `.trim();


    // Create WhatsApp URL (add your phone number format validation as needed)
    const whatsappUrl = `https://wa.me/${contact.phone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 px-6">
        <div className="container mx-auto">
          <div className="text-center text-red-600 p-4 bg-red-50 rounded-xl">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!wasteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 px-6">
        <div className="container mx-auto">
          <div className="text-center text-gray-600 p-4 bg-gray-50 rounded-xl">
            No waste data found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 px-6 pb-20">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-200/20 backdrop-blur-xl"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </motion.div>

      <div className="container mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl border border-green-100 shadow-2xl p-8"
        >
          {/* Header Section */}
          <motion.div
            className="flex items-center space-x-6 mb-8"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
              <TreesIcon className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {wasteData.cropType}
              </h1>
              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="h-5 w-5 mr-2" />
                {wasteData.location.district}, {wasteData.location.state}
              </div>
            </div>
          </motion.div>

          {/* Grid Layout for Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <motion.div
              className="space-y-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/50 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-green-700">Location Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>{wasteData.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Info className="h-5 w-5 text-green-600" />
                    <span>Pincode: {wasteData.location.pincode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-green-700">Availability</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Available From:</span>
                    <span className="font-medium">
                      {new Date(wasteData.availableFrom).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full ${wasteData.status === 'available' ? 'bg-green-100 text-green-700' :
                        wasteData.status === 'booked' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                      }`}>
                      {wasteData.status}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className="space-y-6"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="bg-white/50 rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-green-700">Waste Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Waste Type:</span>
                    <span className="font-medium">{wasteData.wasteType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{wasteData.quantity} {wasteData.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">₹{wasteData.price}/{wasteData.unit}</span>
                  </div>
                </div>
              </div>

              {wasteData.description && (
                <div className="bg-white/50 rounded-2xl p-6">
                  <h2 className="text-xl font-semibold text-green-700 mb-4">Description</h2>
                  <p className="text-gray-600">{wasteData.description}</p>
                </div>
              )}

              {wasteData.status === 'available' && (
                <motion.button
                  onClick={handleWhatsAppContact}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Contact on WhatsApp</span>
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WasteDetail;
