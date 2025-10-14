import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Leaf, BarChart2, ShoppingBag, Tractor, Users2, BookOpen, LogOut, Settings, Mail, MapPin, Calendar, Sparkles, X, Brain, Package, Recycle } from "lucide-react";

const TopNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [user] = useState({
    name: "John Farmer",
    email: "john@example.com",
    picture: null,
  });
  const [isAuthenticated] = useState(true);
  const [selectedRole] = useState("farmer");

  const getNavItems = () => {
    const baseItems = [
      { href: "/digitalmarketplace", label: "Digital Marketplace", icon: <ShoppingBag className="w-4 h-4" /> },
      { href: "/learn", label: "Resources", icon: <BookOpen className="w-4 h-4" /> },
      { href: "/ai-lab", label: "AI Lab", icon: <Brain className="w-4 h-4" /> },
      { href: "/rental", label: "Rental", icon: <Tractor className="w-4 h-4" /> },
      { href: "/waste-conversion", label: "Waste Conversion", icon: <Recycle className="w-4 h-4" /> },
    ];

    if (isAuthenticated && selectedRole === "farmer") {
      return [
        { href: "/farmerDashboard", label: "My Dashboard", icon: <BarChart2 className="w-4 h-4" /> },
        { href: "/marketplace", label: "Browse Waste", icon: <Package className="w-4 h-4" /> },
        ...baseItems,
      ];
    } else if (isAuthenticated && selectedRole === "business") {
      return [
        { href: "/businessDashboard", label: "My Dashboard", icon: <BarChart2 className="w-4 h-4" /> },
        { href: "/marketplace", label: "Browse Waste", icon: <Package className="w-4 h-4" /> },
        ...baseItems,
      ];
    } else {
      return [
        { href: "/role-selection", label: "Get Started", icon: <Users2 className="w-4 h-4" /> },
        { href: "/marketplace", label: "Marketplace", icon: <ShoppingBag className="w-4 h-4" /> },
        ...baseItems,
      ];
    }
  };

  const navItems = getNavItems();

  const menuVariants = {
    closed: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: "easeInOut" } },
    open: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    open: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    setIsDropdownOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogin = () => {
    console.log("Login clicked");
  };

  const getInitials = (name) => {
    return name.split(" ").map((word) => word[0]).join("").toUpperCase();
  };

  const ProfileDrawer = () => (
    <AnimatePresence>
      {isProfileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            onClick={() => setIsProfileOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-96 bg-gradient-to-b from-white to-green-50 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-green-800">Profile</h2>
                <button onClick={() => setIsProfileOpen(false)} className="p-2 hover:bg-green-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-green-600" />
                </button>
              </div>

              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl" />
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                  <div className="flex justify-center -mt-16">
                    <motion.div whileHover={{ scale: 1.1 }} className="relative">
                      <div className="w-24 h-24 border-4 border-white shadow-lg rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials(user?.name || "User Name")}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                    </motion.div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">{user?.name}</h3>
                    <p className="text-green-600 font-medium">
                      {selectedRole === "farmer" ? "Farmer" : selectedRole === "business" ? "Business" : "Member"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-6 h-6" />
                      <div>
                        <p className="font-medium">Contribution Score</p>
                        <p className="text-2xl font-bold">856</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: <Calendar className="w-5 h-5" />, label: "Joined", value: "Mar 2024" },
                    { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "Bangalore" },
                  ].map((item, index) => (
                    <motion.div key={index} whileHover={{ y: -2 }} className="bg-white p-4 rounded-xl shadow-sm">
                      <div className="flex items-center space-x-2 text-green-600">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <p className="font-medium text-gray-800 mt-1">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full px-4 py-3 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors flex items-center justify-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button onClick={handleLogout} className="w-full px-4 py-3 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors flex items-center justify-center space-x-2">
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 px-2 sm:px-3 py-2 sm:py-3 z-40 flex justify-center">
        <nav className="w-full max-w-7xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-green-100/50 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Krishisetu
                </span>
                <span className="text-[10px] sm:text-xs text-green-600 hidden sm:block">
                  Smart Agriculture for a Sustainable Future
                </span>
              </div>
            </a>

            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <a key={index} href={item.href} className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                      {getInitials(user?.name || "User")}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900">My Account</p>
                          </div>
                          {isAuthenticated && selectedRole && (
                            <a href={selectedRole === "farmer" ? "/farmerDashboard" : "/businessDashboard"} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600" onClick={() => setIsDropdownOpen(false)}>
                              <BarChart2 className="w-4 h-4" />
                              <span>Dashboard</span>
                            </a>
                          )}
                          <button onClick={() => { setIsDropdownOpen(false); setIsProfileOpen(true); }} className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 text-left">
                            <Users2 className="w-4 h-4" />
                            <span>Profile</span>
                          </button>
                          <button onClick={handleLogout} className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 text-left">
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={handleLogin} className="hidden sm:flex items-center space-x-2 px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all">
                  <Users2 className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setIsMenuOpen(false)} className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
              <motion.div variants={menuVariants} initial="closed" animate="open" exit="closed" className="lg:hidden fixed top-20 left-2 right-2 sm:left-4 sm:right-4 z-50 bg-white/95 backdrop-blur-lg shadow-xl border border-green-100 rounded-2xl overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex flex-col p-4 space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <a href={item.href} className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </a>
                    </motion.div>
                  ))}
                  <motion.div variants={itemVariants} className="pt-2 border-t border-gray-100">
                    {isAuthenticated ? (
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full px-4 py-3 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 flex items-center justify-center space-x-2 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button onClick={() => { handleLogin(); setIsMenuOpen(false); }} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg flex items-center justify-center space-x-2 transition-all">
                        <Users2 className="w-4 h-4" />
                        <span>Sign In</span>
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <ProfileDrawer />
      <div className="h-20 sm:h-24"></div>
    </>
  );
};

export default TopNavigation;