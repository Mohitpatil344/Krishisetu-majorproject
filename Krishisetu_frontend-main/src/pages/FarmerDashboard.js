import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {  Calendar } from 'lucide-react';
import { 
  User, MapPin, Phone, TreePine, Scale, 
  Package, Plus, Trash2, Mail, Sprout, BarChart, Award, CheckCircle, MoreVertical, Edit2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FarmerWasteCard from '../components/FarmerWasteCard';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FarmerDashboard = () => {
  const { user: authUser } = useAuth();
  const currentUserId = authUser?.id || null;
  const [farmer, setFarmer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddWasteModal, setShowAddWasteModal] = useState(false);
  const [newWaste, setNewWaste] = useState({
    cropType: '',
    wasteType: 'straw',
    quantity: '',
    unit: 'kg',
    price: '',
    availableFrom: '',
    location: {
      address: '',
      district: '',
      state: '',
      pincode: ''
    },
    description: '',
    images: []
  });
  const [wasteListing, setWasteListing] = useState([]);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const wasteTypes = ['straw', 'husk', 'leaves', 'stalks', 'other'];
  const units = ['kg', 'ton', 'quintal'];
  const statusOptions = ['available', 'booked', 'sold', 'cancelled'];

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Prefer current authenticated user; fallback to mock only if unavailable
        const fallbackFarmer = {
          name: 'John Farmer',
          email: 'farmer@example.com',
          phone: '+91 98765 43210',
          picture: null,
          farmDetails: {
            farmSize: '5 acres',
            primaryCrops: 'Rice, Wheat'
          }
        };

        const resolvedFarmer = authUser
          ? {
              name: authUser.name,
              email: authUser.email,
              phone: authUser.phone || '—',
              picture: authUser.picture || null,
              farmDetails: {
                farmSize: authUser.farmDetails?.farmSize || '—',
                primaryCrops: authUser.farmDetails?.primaryCrops || '—'
              }
            }
          : fallbackFarmer;

        setFarmer(resolvedFarmer);
        // Fetch current farmer wastes
        try {
          const token = localStorage.getItem('auth_token');
          const resp = await fetch(`${API_URL}/api/waste/mine`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (resp.ok) {
            const json = await resp.json();
            setWasteListing(json.data.wastes || []);
          } else {
            setWasteListing([]);
          }
        } catch (fetchErr) {
          setWasteListing([]);
        }

      } catch (err) {
        console.error('Error details:', err);
        setError('Failed to load dashboard data');
        setWasteListing([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [authUser]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">No farmer data found</div>
      </div>
    );
  }

  const handleAddWaste = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...newWaste,
        quantity: Number(newWaste.quantity),
        price: Number(newWaste.price)
      };

      const response = await fetch(`${API_URL}/api/waste/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();

      if (data.success) {
        setWasteListing([data.data.waste, ...wasteListing]);
        setShowAddWasteModal(false);
        
        // Reset form
        setNewWaste({
          cropType: '',
          wasteType: 'straw',
          quantity: '',
          unit: 'kg',
          price: '',
          availableFrom: '',
          location: {
            address: '',
            district: '',
            state: '',
            pincode: ''
          },
          description: '',
          images: []
        });

        // Show success message
        alert('Waste listing added successfully!');
      }
    } catch (error) {
      console.error('Error adding waste:', error);
      alert('Failed to add waste listing: ' + error.message);
    }
  };

  const handleStatusUpdate = async (wasteId, newStatus) => {
    try {
      const auth0Id = currentUserId;
      
      const response = await fetch(
        `${API_URL}/api/waste/${wasteId}/sold`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: JSON.stringify({})
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      // Update local state only if API call was successful
      setWasteListing(wasteListing.map(waste => 
        waste._id === wasteId ? { ...waste, status: newStatus } : waste
      ));

      setShowStatusModal(false);
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status. Please try again.');
    }
  };

  // Add error handling for the status update modal
  const openStatusModal = (waste) => {
    if (!currentUserId || (waste.owner && waste.owner !== currentUserId)) {
      alert('You can only update your own waste listings');
      return;
    }
    setSelectedWaste(waste);
    setShowStatusModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Farmer Profile Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-xl rounded-3xl shadow-lg p-8 mb-8 border border-white/20"
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Picture Section */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 p-1">
                {farmer.picture ? (
                  <img 
                    src={farmer.picture} 
                    alt={farmer.name} 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-emerald-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-emerald-600" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1.5">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    {farmer.name}
                  </h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      {farmer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {farmer.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Scale className="w-4 h-4" />
                      {farmer.farmDetails.farmSize}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Sprout className="w-4 h-4" />
                      {farmer.farmDetails.primaryCrops}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Waste Listings */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Waste Listings</h2>
          <button
            onClick={() => setShowAddWasteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Waste
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(wasteListing) && wasteListing.length > 0 ? (
            wasteListing.map((waste) => (
              <FarmerWasteCard key={waste._id} waste={waste} onEdit={openStatusModal} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500 mb-4">No waste posted.</p>
              <button
                onClick={() => setShowAddWasteModal(true)}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Add Your First Listing
              </button>
            </div>
          )}
        </div>

        {/* Add Waste Modal */}
        {showAddWasteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Add New Waste Listing</h3>
                <button
                  onClick={() => setShowAddWasteModal(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddWaste} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Crop Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                    <input
                      type="text"
                      value={newWaste.cropType}
                      onChange={(e) => setNewWaste({...newWaste, cropType: e.target.value})}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  {/* Waste Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                    <select
                      value={newWaste.wasteType}
                      onChange={(e) => setNewWaste({...newWaste, wasteType: e.target.value})}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 capitalize"
                      required
                    >
                      {wasteTypes.map(type => (
                        <option key={type} value={type} className="capitalize">{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity and Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newWaste.quantity}
                        onChange={(e) => setNewWaste({...newWaste, quantity: e.target.value})}
                        className="w-2/3 p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                        required
                      />
                      <select
                        value={newWaste.unit}
                        onChange={(e) => setNewWaste({...newWaste, unit: e.target.value})}
                        className="w-1/3 p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                        required
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹ per unit)</label>
                    <input
                      type="number"
                      value={newWaste.price}
                      onChange={(e) => setNewWaste({...newWaste, price: e.target.value})}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                      required
                    />
                  </div>

                  {/* Available From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                    <input
                      type="date"
                      value={newWaste.availableFrom}
                      onChange={(e) => setNewWaste({...newWaste, availableFrom: e.target.value})}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Location Details */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-700 mb-3">Location Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                      <input
                        type="text"
                        value={newWaste.location.district}
                        onChange={(e) => setNewWaste({
                          ...newWaste,
                          location: { ...newWaste.location, district: e.target.value }
                        })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        value={newWaste.location.state}
                        onChange={(e) => setNewWaste({
                          ...newWaste,
                          location: { ...newWaste.location, state: e.target.value }
                        })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={newWaste.location.pincode}
                        onChange={(e) => setNewWaste({
                          ...newWaste,
                          location: { ...newWaste.location, pincode: e.target.value }
                        })}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newWaste.description}
                    onChange={(e) => setNewWaste({...newWaste, description: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddWasteModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Add Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedWaste && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Update Status</h3>
              <p className="text-gray-600 mb-4">
                Current status: <span className="font-medium capitalize">{selectedWaste.status}</span>
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selectedWaste._id, status)}
                    className={`p-3 rounded-lg border-2 capitalize ${
                      selectedWaste.status === status
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-green-500 hover:bg-green-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
