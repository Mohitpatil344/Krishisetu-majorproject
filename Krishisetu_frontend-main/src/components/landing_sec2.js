import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Flame, Workflow, DollarSign } from 'lucide-react';
import sadFarmer from '../assets/sadFarmer.png';

const Landing_sec2 = () => {
  return (
    <div className="bg-gradient-to-b from-white to-green-50/30 py-20">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-semibold text-green-600 mb-4 inline-block">
            CHALLENGES
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent pb-2 mb-4">
            Problems We're Solving
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg mb-8">
            Addressing critical agricultural waste management challenges that affect farmers and the environment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Problem Statement Content */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-red-100 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Flame className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-2xl font-semibold text-gray-800">
                  350M+ Tons
                </p>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                Of agricultural waste generated annually in India, leading to significant 
                environmental hazards and economic losses.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  icon: <Workflow className="w-6 h-6" />,
                  title: "Inefficient Process",
                  desc: "Poor waste disposal coordination"
                },
                {
                  icon: <DollarSign className="w-6 h-6" />,
                  title: "Economic Loss",
                  desc: "Missed revenue opportunities"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-red-50 hover:shadow-lg transition-all"
                >
                  <div className="text-red-500 mb-4">{item.icon}</div>
                  <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Animated Illustration */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-orange-400/10 blur-3xl transform -rotate-12"></div>
            <motion.div
              animate={{
                x: [0, 0, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              <img 
                src={sadFarmer}
                alt="Agricultural Challenges"
                className="w-full h-auto drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing_sec2;
