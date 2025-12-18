import React from 'react';
import { motion } from 'framer-motion';
import { LeafIcon, TruckIcon, RecycleIcon, Sparkles, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing_sec1 = () => {
  const navigate = useNavigate();

  const handleCropCare = () => {
    // Trigger exit animation and navigate to crop care
    navigate('/cropcare', {
      state: { animateEntrance: true }
    });
  };

  const handleGetStarted = () => {
    // Trigger exit animation and navigate to marketplace
    navigate('/role-selection', {
      state: { animateEntrance: true }
    });
  };

  const handleDashboard = () => {
    // Trigger exit animation and navigate to dashboard
    navigate('/dashboard', {
      state: { animateEntrance: true }
    });
  };

  return (
    <div className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-200/30 backdrop-blur-xl"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 sm:gap-10 items-center relative z-10"
      >
        {/* Text Content */}
        <div className="space-y-6 sm:space-y-8 backdrop-blur-sm bg-white/30 p-4 sm:p-8 rounded-2xl border border-white/20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="relative"
          >
            <Sparkles className="absolute -top-6 -left-6 text-yellow-400 w-8 sm:w-12 h-8 sm:h-12 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent leading-tight py-2">
              Krishisetu :A new era of agricultural transformation
            </h1>
          </motion.div>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg sm:text-xl md:text-2xl text-green-700/80 font-light"
          >
            Optimize waste,create values and opportunities ,promote sustainable agricultural practices
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg overflow-hidden shadow-xl transition-all hover:shadow-green-500/30"
            >
              <div className="absolute inset-0 bg-white/30 group-hover:translate-y-12 transition-transform duration-300"></div>
              <div className="flex items-center space-x-2">
                <LeafIcon className="animate-bounce" />
                <span>Get Started</span>
              </div>
            </button>

            <button
              onClick={handleDashboard}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg overflow-hidden shadow-xl transition-all hover:shadow-blue-500/30"
            >
              <div className="absolute inset-0 bg-white/30 group-hover:translate-y-12 transition-transform duration-300"></div>
              <div className="flex items-center space-x-2">
                <TruckIcon className="animate-bounce" />
                <span>Dashboard</span>
              </div>
            </button>

            <button
              onClick={handleCropCare}
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-lg overflow-hidden shadow-xl transition-all hover:shadow-blue-500/30"
            >
              <div className="absolute inset-0 bg-white/30 group-hover:translate-y-12 transition-transform duration-300"></div>
              <div className="flex items-center space-x-2">
                <Sprout className="animate-bounce" />
                <span>Crop Care</span>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Illustration - Hide on mobile */}
        <motion.div
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="hidden md:block relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-3xl transform rotate-12"></div>
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative"
          >
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-green-400/30 to-emerald-400/30 blur-2xl"></div>
            <RecycleIcon
              size={400}
              className="text-green-600 drop-shadow-2xl filter"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing_sec1;
