import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, ShoppingBag } from 'lucide-react';

const Landing_sec3 = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Intelligent Waste Management",
      description: "AI-powered dashboard for waste tracking, reporting, and pattern prediction"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Supply Chain Optimization",
      description: "Predictive analytics and route optimization for efficient waste collection"
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Digital Marketplace",
      description: "Connect farmers with buyers through our interactive platform"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-emerald-50/30 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-green-600 mb-2 block">FEATURES</span>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            The Krishisetu Advantage
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          <p className="text-xl text-green-700/80 max-w-2xl mx-auto mt-6">
            A smart agricultural waste supply chain optimization platform that transforms 
            waste management through intelligent solutions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-green-100 hover:border-green-200 space-y-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center text-white transform -rotate-6 group-hover:rotate-6 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Landing_sec3;
