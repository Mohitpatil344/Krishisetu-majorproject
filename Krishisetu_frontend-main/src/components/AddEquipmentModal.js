// src/components/AddEquipmentModal.js
import React, { useState, useEffect } from "react";
import { X, Upload, MapPin, Calendar, IndianRupee, Tag, FileText } from "lucide-react";

const AddEquipmentModal = ({ isOpen, onClose, onAdd, editingEquipment, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    brand: "",
    price: "",
    leaseDuration: "",
    location: "",
    image: "",
    availability: "Available",
    availableFrom: "",
    availableTo: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (editingEquipment) {
      setFormData({
        name: editingEquipment.name || "",
        details: editingEquipment.details || "",
        brand: editingEquipment.brand || "",
        price: editingEquipment.price || "",
        leaseDuration: editingEquipment.leaseDuration || "",
        location: editingEquipment.location || "",
        image: editingEquipment.image || "",
        availability: editingEquipment.availability || "Available",
        availableFrom: editingEquipment.availableFrom || "",
        availableTo: editingEquipment.availableTo || "",
      });
      setImagePreview(editingEquipment.image || "");
    } else {
      // Reset form for new equipment
      setFormData({
        name: "",
        details: "",
        brand: "",
        price: "",
        leaseDuration: "",
        location: "",
        image: "",
        availability: "Available",
        availableFrom: "",
        availableTo: "",
      });
      setImagePreview("");
    }
  }, [editingEquipment, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, image: value }));
    setImagePreview(value);
  };

const handleSubmit = () => {
  if (formData.name && formData.price && formData.leaseDuration) {
    const equipmentData = {
      ...formData,
      image: formData.image || "https://images.unsplash.com/photo-1581093588401-22b8d2f94d1f",
      // Convert empty date strings to undefined
      availableFrom: formData.availableFrom || undefined,
      availableTo: formData.availableTo || undefined
    };

    if (editingEquipment) {
      onUpdate({ ...equipmentData, _id: editingEquipment._id });
    } else {
      onAdd(equipmentData);
    }
    
    // Reset form...
  } else {
    alert("Please fill in required fields: Name, Price, and Lease Duration");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingEquipment ? "Edit Equipment" : "Add New Equipment"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Upload className="w-4 h-4" />
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleImageChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
            {imagePreview && (
              <div className="mt-3 rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" onError={() => setImagePreview("")} />
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Equipment Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Deere 5050D Tractor"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Brand/Model
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., John Deere"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the equipment features and specifications..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <IndianRupee className="w-4 h-4" />
                Price/Day <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="500"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Lease Duration <span className="text-red-600">*</span>
              </label>
              <select
                name="leaseDuration"
                value={formData.leaseDuration}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              >
                <option value="">Select Duration</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Available From
              </label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Available Until
              </label>
              <input
                type="date"
                name="availableTo"
                value={formData.availableTo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              Availability Status
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  value="Available"
                  checked={formData.availability === "Available"}
                  onChange={handleChange}
                  className="accent-green-600"
                />
                <span className="text-gray-700 font-medium">Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="availability"
                  value="Unavailable"
                  checked={formData.availability === "Unavailable"}
                  onChange={handleChange}
                  className="accent-red-600"
                />
                <span className="text-gray-700 font-medium">Unavailable</span>
              </label>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Pune, Maharashtra"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              {editingEquipment ? "Update Equipment" : "Add Equipment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEquipmentModal;