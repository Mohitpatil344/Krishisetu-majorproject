// src/pages/BusinessDashboard.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Phone, Building2, Briefcase, 
  Package, Plus, ShoppingCart, Mail, BarChart, Award, CheckCircle, 
  MoreVertical, Edit2, Search, Filter, Calendar, TrendingUp
} from 'lucide-react';

const BusinessDashboard = () => {
  // Mock user data for now - replace with actual user from AuthContext when backend is ready
  const user = {
    sub: 'auth0|1234567890',
    name: 'Business Owner',
    email: 'business@example.com',
    picture: null
  };
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wasteListings, setWasteListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const categories = ['all', 'straw', 'husk', 'leaves', 'stalks', 'other'];
  const locations = ['all', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'Karnataka'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock business data
        const mockBusiness = {
          name: 'Green Solutions Ltd',
          email: 'business@example.com',
          phone: '+91 98765 43210',
          picture: null,
          businessDetails: {
            businessName: 'Green Solutions Ltd',
            businessType: 'Waste Processing'
          }
        };

        // Mock waste listings for business to browse
        const mockWasteListings = [
          {
            _id: '1',
            cropType: 'Rice',
            wasteType: 'straw',
            quantity: 100,
            unit: 'kg',
            price: 25,
            availableFrom: new Date().toISOString(),
            status: 'available',
            auth0Id: 'farmer123',
            location: {
              district: 'Punjab',
              state: 'Punjab',
              pincode: '140001'
            },
            description: 'High quality rice straw available for purchase'
          },
          {
            _id: '2',
            cropType: 'Wheat',
            wasteType: 'husk',
            quantity: 50,
            unit: 'kg',
            price: 30,
            availableFrom: new Date().toISOString(),
            status: 'available',
            auth0Id: 'farmer456',
            location: {
              district: 'Haryana',
              state: 'Haryana',
              pincode: '121001'
            },
            description: 'Fresh wheat husk from organic farming'
          },
          {
            _id: '3',
            cropType: 'Sugarcane',
            wasteType: 'bagasse',
            quantity: 200,
            unit: 'kg',
            price: 20,
            availableFrom: new Date().toISOString(),
            status: 'available',
            auth0Id: 'farmer789',
            location: {
              district: 'Uttar Pradesh',
              state: 'Uttar Pradesh',
              pincode: '201001'
            },
            description: 'Sugarcane bagasse for biofuel production'
          }
        ];

        setBusiness(mockBusiness);
        setWasteListings(mockWasteListings);
        setFilteredListings(mockWasteListings);

      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load dashboard data');
        setWasteListings([]);
        setFilteredListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter listings based on search and filters
  useEffect(() => {
    let filtered = wasteListings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(waste => 
        waste.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        waste.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        waste.location.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(waste => waste.wasteType === selectedCategory);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(waste => waste.location.state === selectedLocation);
    }

    setFilteredListings(filtered);
  }, [wasteListings, searchTerm, selectedCategory, selectedLocation]);

  const handlePurchase = async (wasteId) => {
    try {
      const auth0Id = user.sub.split('|')[1];
      
      const response = await fetch(
        `https://knowcode-protobuf-backend-k16r.vercel.app/api/v1/waste/${wasteId}/purchase`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            buyerId: auth0Id,
            wasteId: wasteId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to purchase');
      }

      alert('Purchase request sent successfully!');
      // Refresh listings
      window.location.reload();
    } catch (error) {
      console.error('Error purchasing:', error);
      alert(error.message || 'Failed to purchase. Please try again.');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  // No data state
  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">No business data found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Business Profile Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-lg p-8 mb-8 border border-white/20"
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 p-1">
                {business.picture ? (
                  <img 
                    src={business.picture} 
                    alt={business.name} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-blue-100 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-blue-600" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    {business.name}
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {business.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {business.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4" />
                      {business.businessDetails?.businessName || 'Business Name'}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      {business.businessDetails?.businessType || 'Business Type'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-blue-100">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by crop type, waste type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Available Waste Listings */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Available Waste Listings</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" />
            {filteredListings.length} listings found
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredListings) && filteredListings.length > 0 ? (
            filteredListings.map((waste) => (
              <motion.div
                key={waste._id || `waste-${Date.now()}-${Math.random()}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize">
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

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">{waste.location.district}, {waste.location.state}</p>
                      <p className="text-xs text-gray-500">PIN: {waste.location.pincode}</p>
                    </div>
                  </div>
                </div>

                {waste.status === 'available' && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handlePurchase(waste._id)}
                      className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Purchase
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No waste listings available</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
