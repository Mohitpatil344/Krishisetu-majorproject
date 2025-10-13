// src/pages/BookingPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import {
  Calendar,
  Package,
  Truck,
  MapPin,
  FileText,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function BookingPage({ equipment, selectedDuration, pricePerDay }) {
  const navigate = useNavigate(); // ✅ Initialize the navigate hook
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTotalDays(diffDays);

      let calculatedPrice = 0;
      if (selectedDuration === "daily") {
        calculatedPrice = pricePerDay * diffDays * quantity;
      } else if (selectedDuration === "weekly") {
        calculatedPrice = (pricePerDay / 6) * diffDays * quantity;
      } else if (selectedDuration === "monthly") {
        calculatedPrice = (pricePerDay / 25) * diffDays * quantity;
      }

      const deliveryFee = deliveryMethod === "delivery" ? 500 : 0;
      setTotalPrice(calculatedPrice + deliveryFee);
    } else {
      setTotalDays(0);
      setTotalPrice(0);
    }
  }, [startDate, endDate, quantity, deliveryMethod, selectedDuration, pricePerDay]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform your API call or booking submission logic here

    // Reset form
    setStartDate("");
    setEndDate("");
    setQuantity(1);
    setDeliveryMethod("pickup");
    setDeliveryAddress("");
    setAdditionalNotes("");
    setTotalDays(0);
    setTotalPrice(0);

    // Optional: show alert
    alert("Booking request submitted!");

    navigate("/renter-dashboard"); // ✅ This will now work correctly
  };

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
          <h2 className="text-3xl font-bold text-white mb-2">Book Equipment</h2>
          <p className="text-green-50">Complete the form to request your booking</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {equipment?.name || "Equipment Name"}
                </h3>
                <p className="text-sm text-gray-600">
                  {equipment?.brand || "Brand Name"}
                </p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      required
                      min={getTodayDate()}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
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
                      required
                      min={startDate || getTodayDate()}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <Package className="w-4 h-4 text-green-600" />
                    Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  />
                </div> */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                    <Truck className="w-4 h-4 text-green-600" />
                    Delivery Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        deliveryMethod === "pickup"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <MapPin
                          className={`w-5 h-5 ${
                            deliveryMethod === "pickup" ? "text-green-600" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div
                        className={`font-semibold ${
                          deliveryMethod === "pickup" ? "text-green-900" : "text-gray-900"
                        }`}
                      >
                        Self Pickup
                      </div>
                      <div className="text-xs text-gray-600 mt-1">Free</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        deliveryMethod === "delivery"
                          ? "border-green-600 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Truck
                          className={`w-5 h-5 ${
                            deliveryMethod === "delivery" ? "text-green-600" : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div
                        className={`font-semibold ${
                          deliveryMethod === "delivery" ? "text-green-900" : "text-gray-900"
                        }`}
                      >
                        Home Delivery
                      </div>
                      <div className="text-xs text-gray-600 mt-1">₹500</div>
                    </button>
                  </div>
                </div>

                {deliveryMethod === "delivery" && (
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      Delivery Address
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your complete delivery address"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                    />
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any special requirements or instructions?"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 sticky top-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-600" />
                  Price Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">
                      {totalDays > 0 ? `${totalDays} ${totalDays === 1 ? "day" : "days"}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium text-gray-900">{quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium text-gray-900">₹{pricePerDay}/day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-medium text-gray-900">
                      {deliveryMethod === "delivery" ? "₹500" : "Free"}
                    </span>
                  </div>

                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-gray-900">Total Amount:</span>
                      <div className="flex items-baseline gap-1">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {totalPrice > 0 ? totalPrice.toLocaleString() : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900">
                      <p className="font-semibold mb-1">Payment Terms</p>
                      <p className="text-blue-800">
                        Security deposit required. Full payment due upon
                        confirmation. Cancellation allowed up to 24 hours
                        before start date.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!startDate || !endDate || totalPrice === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Submit Booking Request
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookingPage;