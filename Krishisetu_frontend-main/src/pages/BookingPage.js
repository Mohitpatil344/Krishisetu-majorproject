// src/pages/BookingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  Package,
  Truck,
  MapPin,
  FileText,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import bookingService from "../services/bookingService";

function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Get equipment data from navigation state
  const { equipment, selectedDuration: passedDuration, pricePerDay } = location.state || {};

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    quantity: 1,
    deliveryMethod: "pickup",
    deliveryAddress: "",
    additionalNotes: "",
  });

  const [selectedDuration, setSelectedDuration] = useState(passedDuration || "daily");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if no equipment data
  useEffect(() => {
    if (!equipment || !pricePerDay) {
      navigate(-1);
    }
  }, [equipment, pricePerDay, navigate]);

  // Calculate total days and price
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);

      let calculatedPrice = 0;
      if (selectedDuration === "daily") {
        calculatedPrice = pricePerDay * diffDays * formData.quantity;
      } else if (selectedDuration === "weekly") {
        // Weekly discount: ~14% cheaper per day (multiply by 0.86)
        calculatedPrice = pricePerDay * 0.86 * diffDays * formData.quantity;
      } else if (selectedDuration === "monthly") {
        // Monthly discount: ~20% cheaper per day (multiply by 0.8)
        calculatedPrice = pricePerDay * 0.8 * diffDays * formData.quantity;
      }

      const deliveryFee = formData.deliveryMethod === "delivery" ? 500 : 0;
      setTotalPrice(Math.round(calculatedPrice + deliveryFee));
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [
    formData.startDate,
    formData.endDate,
    selectedDuration,
    formData.deliveryMethod,
    formData.quantity,
    pricePerDay,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (increment) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + increment),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.startDate || !formData.endDate) {
      setError("Please select start and end dates");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date must be after start date");
      return;
    }

    if (formData.deliveryMethod === "delivery" && !formData.deliveryAddress.trim()) {
      setError("Delivery address is required for home delivery");
      return;
    }

    if (formData.quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        equipmentId: equipment._id,
        equipmentName: equipment.name,
        equipmentBrand: equipment.brand,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalDays,
        quantity: formData.quantity,
        pricePerDay,
        totalPrice,
        selectedDuration,
        deliveryMethod: formData.deliveryMethod,
        deliveryAddress: formData.deliveryAddress.trim() || null,
        additionalNotes: formData.additionalNotes.trim(),
      };

   const response = await bookingService.createBooking(bookingData);

      if (response.success) {
        alert("Booking request submitted successfully!");
        navigate("/renter-dashboard");
      }
    } catch (err) {
      setError(err.message || "Failed to create booking");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  const deliveryFee = formData.deliveryMethod === "delivery" ? 500 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white mb-2">Book Equipment</h2>
            <p className="text-green-50">Complete the form to request your booking</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Equipment Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Equipment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Equipment Name:</span>
                      <span className="font-semibold text-gray-900">{equipment.name}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-semibold text-gray-900">{equipment.brand || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold text-gray-900">{equipment.location || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        required
                        min={getTodayDate()}
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        required
                        min={formData.startDate || getTodayDate()}
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <Package className="w-4 h-4 text-green-600" />
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={formData.quantity <= 1}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                    >
                      <Minus className="w-5 h-5 text-gray-700" />
                    </button>
                    <div className="flex-1 max-w-xs">
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-center font-semibold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
                    >
                      <Plus className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <Package className="w-4 h-4 text-green-600" />
                    Select Duration Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["daily", "weekly", "monthly"].map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setSelectedDuration(duration)}
                        className={`py-3 px-4 rounded-xl font-medium text-sm transition-all capitalize ${
                          selectedDuration === duration
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedDuration === "weekly" && "Save ~14% with weekly rates"}
                    {selectedDuration === "monthly" && "Save ~20% with monthly rates"}
                  </p>
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <Truck className="w-4 h-4 text-green-600" />
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          deliveryMethod: "pickup",
                        }))
                      }
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.deliveryMethod === "pickup"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MapPin
                          className={`w-5 h-5 ${
                            formData.deliveryMethod === "pickup" ? "text-green-600" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div
                        className={`font-semibold ${
                          formData.deliveryMethod === "pickup" ? "text-green-900" : "text-gray-900"
                        }`}
                      >
                        Self Pickup
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Free</div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          deliveryMethod: "delivery",
                        }))
                      }
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.deliveryMethod === "delivery"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Truck
                          className={`w-5 h-5 ${
                            formData.deliveryMethod === "delivery" ? "text-green-600" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div
                        className={`font-semibold ${
                          formData.deliveryMethod === "delivery" ? "text-green-900" : "text-gray-900"
                        }`}
                      >
                        Home Delivery
                      </div>
                      <div className="text-xs text-gray-600 mt-1">₹500</div>
                    </button>
                  </div>
                </div>

                {/* Delivery Address */}
                {formData.deliveryMethod === "delivery" && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Delivery Address
                    </label>
                    <textarea
                      name="deliveryAddress"
                      required
                      rows={3}
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      placeholder="Enter your complete delivery address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                    />
                  </div>
                )}

                {/* Additional Notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any special requirements or instructions?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Right Section - Price Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 sticky top-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <IndianRupee className="w-5 h-5 text-green-600" />
                    Price Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Dates Selected:</span>
                      <span className="font-medium text-gray-900">
                        {formData.startDate && formData.endDate
                          ? `${totalDays} ${totalDays === 1 ? "day" : "days"}`
                          : "Not selected"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium text-gray-900">{formData.quantity}</span>
                    </div>

                    <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Duration Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{selectedDuration}</span>
                    </div>

                    <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Price Per Day:</span>
                      <span className="font-medium text-gray-900">₹{pricePerDay}</span>
                    </div>

                    <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Rental Charge:</span>
                      <span className="font-medium text-gray-900">
                        ₹{totalPrice > 0 ? (totalPrice - deliveryFee).toLocaleString() : "0"}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm pb-3 border-b border-gray-300">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium text-gray-900">
                        {formData.deliveryMethod === "delivery" ? "₹500" : "Free"}
                      </span>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 mt-4">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-900 text-lg">Total Amount:</span>
                        <div className="flex items-baseline gap-1">
                          <IndianRupee className="w-6 h-6 text-green-600" />
                          <span className="text-3xl font-bold text-green-600">
                            {totalPrice > 0 ? totalPrice.toLocaleString() : "0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms Info */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-900">
                        <p className="font-semibold mb-2">Booking Terms</p>
                        <ul className="space-y-1 text-blue-800 list-disc list-inside">
                          <li>Security deposit required</li>
                          <li>Full payment due on confirmation</li>
                          <li>Cancel up to 24 hrs before start</li>
                          <li>Technical support included</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!formData.startDate || !formData.endDate || totalPrice === 0 || loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Submit Booking Request
                      </>
                    )}
                  </button>

                  {/* Secure Payment Badge */}
                  <div className="mt-6 pt-6 border-t border-gray-300 text-center">
                    <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Secure Payment & Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;