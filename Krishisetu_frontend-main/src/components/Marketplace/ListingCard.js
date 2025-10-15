import React, { useState } from 'react';
import { X, Upload, MapPin, Package, IndianRupee, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react';

const CreateListingModal = ({ onClose, onListingCreated }) => {
  const [formData, setFormData] = useState({
    wasteType: '',
    category: 'organic',
    location: '',
    quantity: '',
    price: '',
    description: '',
    image: '🌱',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wasteTypeOptions = [
    { value: 'Organic Waste', emoji: '🌱' },
    { value: 'Crop Residue', emoji: '🌾' },
    { value: 'Food Waste', emoji: '🥬' },
    { value: 'Agricultural Waste', emoji: '🌿' },
    { value: 'Animal Waste', emoji: '🐄' },
    { value: 'Garden Waste', emoji: '🌻' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleWasteTypeChange = (e) => {
    const selectedType = e.target.value;
    const selectedOption = wasteTypeOptions.find(opt => opt.value === selectedType);
    setFormData(prev => ({
      ...prev,
      wasteType: selectedType,
      image: selectedOption ? selectedOption.emoji : '🌱',
    }));
    if (errors.wasteType) setErrors(prev => ({ ...prev, wasteType: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.wasteType.trim()) newErrors.wasteType = 'Waste type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) newErrors.quantity = 'Valid quantity is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newListing = {
        id: Date.now(),
        wasteType: formData.wasteType,
        category: formData.category,
        location: formData.location,
        quantity: `${formData.quantity} kg`,
        price: formData.price,
        description: formData.description,
        image: formData.image,
        postedDate: 'Just now',
        seller: 'You',
        featured: false,
      };

      if (onListingCreated) onListingCreated(newListing);
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-green-600 to-green-700 rounded-t-3xl p-6 text-white flex justify-between items-center z-10">
          <div>
            <h2 className="text-3xl font-bold">Create New Listing</h2>
            <p className="text-green-50 text-sm mt-1">List your agricultural waste for sale</p>
          </div>
          <button onClick={onClose} className="text-white/90 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          
          {/* Waste Type */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Waste Type <span className="text-red-500">*</span></label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
              <select
                name="wasteType"
                value={formData.wasteType}
                onChange={handleWasteTypeChange}
                className={`w-full pl-11 pr-4 py-3.5 border-2 ${errors.wasteType ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none`}
                required
              >
                <option value="">Select waste type</option>
                {wasteTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.emoji} {opt.value}</option>)}
              </select>
            </div>
            {errors.wasteType && <p className="text-red-500 text-xs mt-2 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.wasteType}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all appearance-none bg-white"
              required
            >
              <option value="organic">Organic</option>
              <option value="crop">Crop Residue</option>
              <option value="food">Food Waste</option>
              <option value="animal">Animal Waste</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="location"
                placeholder="e.g., Mumbai, Maharashtra"
                value={formData.location}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3.5 border-2 ${errors.location ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                required
              />
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-2 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.location}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity (kg) <span className="text-red-500">*</span></label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                name="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3.5 border-2 ${errors.quantity ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                step="1"
                min="1"
                required
              />
            </div>
            {errors.quantity && <p className="text-red-500 text-xs mt-2 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.quantity}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹ per kg) <span className="text-red-500">*</span></label>
            <div className="relative">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="number"
                name="price"
                placeholder="Enter price per kg"
                value={formData.price}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3.5 border-2 ${errors.price ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all`}
                step="0.01"
                min="0.01"
                required
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-2 flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.price}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea
                name="description"
                placeholder="Describe the waste quality, storage, availability, etc."
                value={formData.description}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3.5 border-2 ${errors.description ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none`}
                rows="4"
                maxLength="1000"
                required
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              {errors.description ? (
                <p className="text-red-500 text-xs flex items-center"><AlertCircle size={12} className="mr-1"/> {errors.description}</p>
              ) : formData.description.length >= 20 ? (
                <p className="text-green-600 text-xs flex items-center"><CheckCircle size={12} className="mr-1"/> Good description</p>
              ) : null}
              <p className="text-xs text-gray-500">{formData.description.length}/1000</p>
            </div>
          </div>

          {/* Listing Preview */}
          {formData.wasteType && formData.price && formData.quantity && (
            <div className="md:col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Image size={20} className="mr-2 text-green-600"/> Listing Preview
              </h3>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{formData.image}</div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">{formData.wasteType}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={14} className="mr-1 text-green-600"/> {formData.location || 'Location'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Package size={14} className="mr-1 text-green-600"/> {formData.quantity} kg
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Price per kg</p>
                        <p className="text-2xl font-bold text-green-600">₹{formData.price}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Value</p>
                        <p className="text-lg font-bold text-gray-700">
                          ₹{(parseFloat(formData.price) * parseFloat(formData.quantity)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="md:col-span-2 flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Listing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Upload size={20} className="mr-2"/> Create Listing
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;
