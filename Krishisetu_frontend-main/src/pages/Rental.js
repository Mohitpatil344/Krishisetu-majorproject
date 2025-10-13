import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tractor, Plus, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import equipmentService from "../services/equipmentService";
import AddEquipmentModal from "../components/AddEquipmentModal";
import CardRental from "../components/cardrental";

const Rental = () => {
  const { user, hasRole, loading: authLoading } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();



  // Fetch equipment on component mount
  useEffect(() => {
    if (!authLoading) {
      fetchEquipment();
    }
  }, [authLoading]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await equipmentService.getAllEquipment();
      setRentals(response.data.equipment || []);
    } catch (err) {
      setError(err.message || 'Failed to load equipment');
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRentClick = (rental) => {
    navigate("/rental-details", { state: rental });
  };

  const handleEditClick = (equipment) => {
    setEditingEquipment(equipment);
    setIsModalOpen(true);
  };

  const handleAddEquipment = async (equipment) => {
    try {
      const response = await equipmentService.addEquipment(equipment);
      
      if (response.success) {
        setRentals([response.data.equipment, ...rentals]);
        setIsModalOpen(false);
        alert('Equipment added successfully!');
      }
    } catch (err) {
      console.error('Error adding equipment:', err);
      alert(err.message || 'Failed to add equipment');
    }
  };

  const handleUpdateEquipment = async (updatedEquipment) => {
    try {
      const { _id, ...equipmentData } = updatedEquipment;
      
      const response = await equipmentService.updateEquipment(_id, equipmentData);
      
      if (response.success) {
        setRentals(prevRentals =>
          prevRentals.map(rental =>
            rental._id === _id ? response.data.equipment : rental
          )
        );
        setIsModalOpen(false);
        setEditingEquipment(null);
        alert('Equipment updated successfully!');
      }
    } catch (err) {
      console.error('Error updating equipment:', err);
      alert(err.message || 'Failed to update equipment');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEquipment(null);
  };

  // Show loading state during auth loading
  if (authLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Show loading state for equipment
  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading equipment...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchEquipment}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if user is business
  const isBusinessUser = hasRole('business');

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 rounded-xl bg-green-100 mb-4">
            <Tractor className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Farm Equipment Rental
          </h1>
          <p className="text-green-700/80 mt-2 text-base md:text-lg max-w-2xl mx-auto">
            {isBusinessUser
              ? 'Manage and rent out your farming equipment'
              : 'Rent high-quality farming tools and tractors with ease'}
          </p>
        </motion.div>

        {isBusinessUser ? (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                setEditingEquipment(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New Equipment
            </button>
          </div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center"
        >
          {rentals && rentals.length > 0 ? (
            rentals.map((rental) => {
              const canEditThis = isBusinessUser && (
                rental.businessId === user?.id || rental.businessId === user?._id
              );
              
              return (
                <CardRental
                  key={rental._id}
                  rental={{
                    ...rental,
                    id: rental._id
                  }}
                  onRentClick={handleRentClick}
                  onEditClick={handleEditClick}
                  canEdit={canEditThis}
                />
              );
            })
          ) : (
            <div className="col-span-full text-center py-20">
              <Tractor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No equipment available yet</p>
              {isBusinessUser && (
                <p className="text-gray-400 text-sm mt-2">
                  Click "Add New Equipment" to get started
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal - render for business users */}
      {isBusinessUser && (
        <AddEquipmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAdd={handleAddEquipment}
          editingEquipment={editingEquipment}
          onUpdate={handleUpdateEquipment}
        />
      )}
    </div>
  );
};

export default Rental;