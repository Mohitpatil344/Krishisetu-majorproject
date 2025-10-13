import React from 'react';
import { motion } from 'framer-motion';
import { RocketIcon, ArrowRight, PlayCircle, Users2 } from 'lucide-react';
import { useAuth0 } from "@auth0/auth0-react"; // Add this import
import { useNavigate } from 'react-router-dom';

const Landing_sec5 = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0(); // Add isAuthenticated

  const handleLogin = () => {
    loginWithRedirect();
  };

  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-green-900 to-emerald-800 py-20 relative overflow-hidden">
      {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4ade8066,#22c55e66)] mix-blend-multiply"/>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent"/>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
            >
          <RocketIcon className="w-16 h-16 text-white/80 mx-auto mb-8"/>
          <span className="text-green-50/90 font-semibold mb-2 block">JOIN Krishisetu</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Transform Agricultural <br/> Waste Management?
          </h2>
          <p className="text-xl text-green-50/90 mb-12">
            Join thousands of farmers and businesses already benefiting from our platform
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white text-green-800 px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
            >
              <span onClick={() => navigate('/role-selection')}>Get Started Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </motion.button>

            {/* Only show sign in button if user is not authenticated */}
              {!isAuthenticated && (
                <motion.button
                  onClick={handleLogin}  // Add this onClick handler
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-green-800 text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-green-50/20 hover:bg-green-700 transition-all duration-300 flex items-center space-x-2"
                >
                  <Users2 className="w-5 h-5"/>
                  <span>Sign in</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing_sec5;
