import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  LeafIcon,
  BarChart2,
  ShoppingBag,
  Tractor,
  Users2,
  BookOpen,
  LogOut,
  Settings,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  X,
  Brain,
  Building2,
  Package,
  Recycle,
  FileText,
  Store
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "../contexts/AuthContext";
import { useRole } from "../contexts/RoleContext";

const TopNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout, isAuthenticated, login } = useAuth();
  const { selectedRole, clearRole } = useRole();

  const getNavItems = () => {
    const baseItems = [
      {
        href: "/digitalmarketplace",
        label: "Digital Marketplace",
        icon: <ShoppingBag className="w-4 h-4" />,
      },
      {
        href: "/learn",
        label: "Resources",
        icon: <BookOpen className="w-4 h-4" />,
      },
      { href: "/ai-lab", label: "AI Lab", icon: <Brain className="w-4 h-4" /> },
      {
        href: "/rental",
        label: "Rental",
        icon: <Tractor className="w-4 h-4" />,
      },
      {
        href: "/waste-conversion",
        label: "Waste Conversion",
        icon: <Recycle className="w-4 h-4" />,
      },
      {
        href: "/schemes",
        label: "Schemes",
        icon: <FileText className="w-4 h-4" />,
      }
    ];

    if (isAuthenticated && selectedRole === 'farmer') {
      return [
        {
          href: "/farmerDashboard",
          label: "My Dashboard",
          icon: <BarChart2 className="w-4 h-4" />,
        },
        {
          href: "/marketplace",
          label: "Browse Waste",
          icon: <Package className="w-4 h-4" />,
        },
        ...baseItems,
      ];
    } else if (isAuthenticated && selectedRole === 'business') {
      return [
        {
          href: "/businessDashboard",
          label: "My Dashboard",
          icon: <BarChart2 className="w-4 h-4" />,
        },
        {
          href: "/marketplace",
          label: "Browse Waste",
          icon: <Package className="w-4 h-4" />,
        },
        ...baseItems,
      ];
    } else {
      return [
        {
          href: "/role-selection",
          label: "Get Started",
          icon: <Users2 className="w-4 h-4" />,
        },
        {
          href: "/marketplace",
          label: "Bazzar",
          icon: <Store className="w-4 h-4" />,
        },
        ...baseItems,
      ];
    }
  };

  const navItems = getNavItems();

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  const handleLogout = () => {
    // Clear auth state and role, then redirect to role selection
    logout();
    clearRole();
    window.location.href = '/role-selection';
  };

  const handleLogin = () => {
    if (login) {
      login();
    } else {
      // Fallback to role selection page if login function isn't available
      window.location.href = '/role-selection';
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
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
            className="fixed right-0 top-0 h-screen w-full sm:w-[400px] bg-gradient-to-b from-white to-green-50 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-green-800">Profile</h2>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 hover:bg-green-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-green-600" />
                </button>
              </div>

              {/* Profile Card */}
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-2xl" />
                <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                  <div className="flex justify-center -mt-16">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                        <AvatarImage src={user?.picture} alt={user?.name} />
                        <AvatarFallback>
                          {getInitials(user?.name || "User Name")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                    </motion.div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-gray-800">
                      {user?.name}
                    </h3>
                    <p className="text-green-600 font-medium">
                      {selectedRole === 'farmer' ? 'Farmer' : selectedRole === 'business' ? 'Business' : 'Member'}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Details */}
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

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl shadow-lg text-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-6 h-6" />
                      <div>
                        <p className="font-medium">Contribution Score</p>
                        <p className="text-2xl font-bold">856</p>
                      </div>
                    </div>
                    <div className="w-16 h-16">
                      {/* Add a circular progress indicator here if needed */}
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Calendar className="w-5 h-5" />,
                      label: "Joined",
                      value: "Mar 2024",
                    },
                    {
                      icon: <MapPin className="w-5 h-5" />,
                      label: "Location",
                      value: "Bangalore",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      className="bg-white p-4 rounded-xl shadow-sm"
                    >
                      <div className="flex items-center space-x-2 text-green-600">
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <p className="font-medium text-gray-800 mt-1">
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="w-full px-4 py-3 rounded-xl bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors flex items-center justify-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
                >
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

  const dropdownContent = (
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {isAuthenticated && selectedRole && (
        <DropdownMenuItem asChild>
          <Link to={selectedRole === 'farmer' ? '/farmerDashboard' : '/businessDashboard'} className="text-gray-600">
            <BarChart2 className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={() => setIsProfileOpen(true)}
        className="text-gray-600"
      >
        <Users2 className="mr-2 h-4 w-4" />
        Profile
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleLogout} className="text-green-600">
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <>
      <div className="fixed top-0 left-0 right-0 px-2 sm:px-4 py-2 sm:py-4 z-50 flex justify-center overflow-x-hidden">
        <nav className="w-[98%] max-w-none bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-green-100/20 px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <LeafIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Krishisetu
                </span>
                <span className="text-xs text-green-600 hidden sm:block">
                  Smart Agriculture for a Sustainable Future
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item, index) => (
                <NavLink key={index} href={item.href}>
                  <div className="flex items-center space-x-1">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              ))}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                        <AvatarImage src={user?.picture} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                          {getInitials(user?.name || user?.businessName || "User")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:block text-sm font-medium text-gray-700">
                        {user?.name || user?.businessName}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  {dropdownContent}
                </DropdownMenu>
              ) : (
                <button
                  onClick={() => handleLogin()}
                  className="hidden sm:flex items-center space-x-2 px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all"
                >
                  <Users2 className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-green-50 text-green-600 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation with AnimatePresence */}
        <AnimatePresence mode="wait">
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              />

              {/* Mobile Menu */}
              <motion.div
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="md:hidden fixed top-[4.5rem] left-0 right-0 z-50 bg-white/70 backdrop-blur-lg shadow-xl border-t border-green-100/20 mx-2 rounded-2xl overflow-hidden"
              >
                <motion.div
                  className="flex flex-col p-4 space-y-2"
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  {navItems.map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Link
                        to={item.href}
                        className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 text-gray-600 hover:text-green-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  <motion.div variants={itemVariants}>
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 mt-2 rounded-xl bg-red-500 text-white font-semibold flex items-center justify-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLogin()}
                        className="w-full px-4 py-2 mt-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center space-x-2"
                      >
                        <Users2 className="w-4 h-4" />
                        <span>Sign In</span>
                      </button>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        <ProfileDrawer />
      </div>
    </>
  );
};

const NavLink = ({ href, children }) => (
  <Link
    to={href}
    className="font-medium text-gray-600 hover:text-green-600 transition-colors"
  >
    {children}
  </Link>
);

export default TopNavigation;