import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Phone, TreesIcon, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';

const Marketplace = () => {
  const [wasteListings, setWasteListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const animateEntrance = location.state?.animateEntrance;

  // Memoize the fetch function to prevent unnecessary recreations
  const fetchWasteListings = useCallback(async (searchQuery = '') => {
    try {
      setIsLoading(true);

      // Determine which endpoint to use based on search query
      const url = searchQuery
        ? `https://knowcode-protobuf-backend.vercel.app/api/v1/waste/search?query=${encodeURIComponent(searchQuery)}`
        : 'https://knowcode-protobuf-backend.vercel.app/api/v1/waste/all';

      const response = await fetch(url);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch waste listings');
      }

      // Update data extraction based on API response structure
      const listings = searchQuery
        ? responseData.data.wastes // For search endpoint
        : responseData.data.waste; // For all listings endpoint

      setWasteListings(Array.isArray(listings) ? listings : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setWasteListings([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props or state

  // Initial fetch on component mount
  useEffect(() => {
    fetchWasteListings();
  }, [fetchWasteListings]);

  // Debounced search effect
  useEffect(() => {
    // Don't search on initial render (empty search term)
    if (searchTerm === '') {
      return;
    }

    const debounceTimer = setTimeout(() => {
      fetchWasteListings(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchWasteListings]);

  return (
    <motion.div
      initial={animateEntrance ? { scale: 1.2, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 px-6 pb-20"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Agricultural Waste Marketplace
          </h1>
          <p className="text-green-700/80 text-lg">
            Connect with farmers and purchase agricultural waste for sustainable use
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by crop, waste type, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 rounded-xl border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-white/70 backdrop-blur-sm"
            />
            {isLoading && (
              <div className="absolute right-4 top-3">
                <Loader2 className="w-5 h-5 animate-spin text-green-600" />
              </div>
            )}
          </div>
          <button className="flex items-center space-x-2 px-6 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-green-100 text-green-700 hover:bg-green-50 transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 p-4 bg-red-50 rounded-xl">
            Error: {error}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && wasteListings.length === 0 && (
          <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-xl">
            <TreesIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Listings Found</h3>
            <p className="text-gray-500">
              {searchTerm ? `No results for "${searchTerm}"` : 'No waste listings available at the moment'}
            </p>
          </div>
        )}

        {/* Waste Listings Grid */}
        {!isLoading && !error && wasteListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wasteListings.map((waste, index) => (
              <motion.div
                key={waste._id || index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-green-100 shadow-lg hover:shadow-xl transition-all p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
                      <TreesIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 capitalize">{waste.cropType}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {waste.location.district}, {waste.location.state}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${waste.status === 'available' ? 'bg-green-100 text-green-700' :
                      waste.status === 'booked' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {waste.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Waste Type:</span>
                    <span className="font-medium text-gray-800 capitalize">{waste.wasteType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium text-gray-800">{waste.quantity} {waste.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available From:</span>
                    <span className="font-medium text-gray-800">
                      {format(new Date(waste.availableFrom), 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-green-600">₹{waste.price}/{waste.unit}</span>
                  </div>
                  {waste.description && (
                    <div className="text-sm text-gray-600 mt-2">
                      <p className="line-clamp-2">{waste.description}</p>
                    </div>
                  )}
                </div>

                {waste.status === 'available' && (
                  <button
                    onClick={() => navigate(`/waste/${waste._id}`)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all"
                  >
                    View Details
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Marketplace;