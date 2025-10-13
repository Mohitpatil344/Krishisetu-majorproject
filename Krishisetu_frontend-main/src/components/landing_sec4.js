import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp } from 'lucide-react';
import screenshot1 from '../assets/screenshot1.jpeg';
import screenshot2 from '../assets/screenchot2.jpeg';

const Landing_sec4 = () => {
  const appFeature = {
    title: "Smart Agricultural Waste Management",
    description: "Our platform simplifies the process of agricultural waste management with an intuitive interface, connecting farmers with buyers seamlessly.",
    images: {
      main: screenshot1,
      secondary: screenshot2,
    },
    stats: [
      { icon: <TrendingUp/>, value: "50%", label: "Waste Utilization" },
      { icon: <Users/>, value: "1000+", label: "Active Users" },
    ]
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-green-600 mb-2 block">OUR PLATFORM</span>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Simple and Efficient Solution
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A user-friendly platform that makes agricultural waste management accessible to everyone
          </p>
        </motion.div>

        {/* Feature Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Feature Description */}
          <div className="md:pr-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">{appFeature.title}</h3>
            <p className="text-gray-600 mb-8">{appFeature.description}</p>
            
            <div className="grid grid-cols-2 gap-6">
              {appFeature.stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-4 rounded-xl shadow-lg border border-green-100"
                >
                  <div className="text-green-600 mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile App Preview - Updated Positioning */}
          <motion.div className="relative h-[500px] flex items-center justify-center">
            {/* Phone Mockups with adjusted positioning */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute w-[200px] h-[400px] right-[20%] top-0" // Changed from right-0
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-100">
                <img
                  src={appFeature.images.secondary}
                  alt="App Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute w-[200px] h-[400px] left-[20%] bottom-0 z-10" // Changed from left-0
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-100">
                <img
                  src={appFeature.images.main}
                  alt="App Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing_sec4;

