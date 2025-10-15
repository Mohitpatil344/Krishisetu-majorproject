import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Package,
  IndianRupee,
  MapPin,
  User,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import bookingService from "../services/bookingService";



function RenterDashboard() {
  const navigate = useNavigate(); // ← add this line
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]); // Add this line
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getRenterBookings();
if (response && response.data && Array.isArray(response.data.bookings)) {
  setBookings(response.data.bookings);
  setRequests(response.data.bookings);
} else if (Array.isArray(response.bookings)) {
  // In case your service returns { bookings: [...] }
  setBookings(response.bookings);
  setRequests(response.bookings);
} else {
  console.warn("Unexpected booking response:", response);
}
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

const handleApprove = async (request) => {
  try {
    const response = await bookingService.updateBookingStatus(request._id, "confirmed");
    
    if (response.success) {
      setRequests(
        requests.map((r) =>
          r._id === request._id ? { ...r, status: "confirmed" } : r
        )
      );

      // Redirect to Agreement page
      navigate("/agreement"); // No ID passed
    }
  } catch (err) {
    alert("Failed to update booking: " + err.message);
    console.error("Approve error:", err);
  }
};


const handleReject = async () => {
  if (selectedRequest && rejectReason.trim()) {
    try {
      const response = await bookingService.updateBookingStatus(
        selectedRequest._id,
        "rejected",
        rejectReason
      );

      if (response.success) {
        // Remove the rejected booking from the visible list
        setRequests((prev) =>
          prev.filter((r) => r._id !== selectedRequest._id)
        );

        setShowRejectModal(false);
        setRejectReason("");
        setSelectedRequest(null);
      } else {
        alert("Failed to reject booking: " + response.message);
      }
    } catch (err) {
      alert("Failed to reject booking: " + err.message);
      console.error("Reject error:", err);
    }
  }
};


  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

 
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateTotalAmount = (booking) => {
    return booking.pricePerDay * booking.totalDays;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading booking requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2 text-center">Error Loading Bookings</h3>
          <p className="text-red-700 text-center mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-4 shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-4 h-4" />
              <span>Equipment Rental Platform</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              Booking Requests
            </h1>
            <p className="text-lg text-gray-600">
              Review and manage rental requests from farmers
            </p>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 p-16 text-center">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Pending Requests</h3>
              <p className="text-gray-600 text-lg">All booking requests have been processed</p>
            </div>
          ) : (
            <div className="space-y-8">
              {pendingRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden hover:shadow-2xl hover:border-gray-300/50 transition-all duration-300 group"
                >
                  <div className="relative bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 px-8 py-6">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_3s_linear_infinite]"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-semibold mb-1 tracking-wide uppercase">Request ID</p>
                        <p className="text-white text-2xl font-bold tracking-tight">
                          {request.bookingId || request._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/30 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
                          </div>
                          <span className="text-white font-bold text-sm">Pending Review</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100 group-hover:border-emerald-200 transition-all">
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-3.5 shadow-lg shadow-emerald-500/30">
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-2">Farmer Details</p>
                              <p className="text-xl font-bold text-gray-900 mb-1">
                                {request.farmerId?.fullName || request.farmerId?.username || "N/A"}
                              </p>
                              <p className="text-sm font-medium text-gray-600">
                                {request.farmerId?.phoneNumber || "Contact not available"}
                              </p>
                              <div className="mt-3 pt-3 border-t border-emerald-200">
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {request.deliveryAddress || request.farmerId?.address || "Address not provided"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100 group-hover:border-blue-200 transition-all">
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-3.5 shadow-lg shadow-blue-500/30">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Equipment Details</p>
                              <p className="text-xl font-bold text-gray-900 mb-1">
                                {request.equipmentName || request.equipmentId?.name || "N/A"}
                              </p>
                              <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-lg mt-1">
                                <span className="text-xs font-semibold text-blue-700">Brand:</span>
                                <span className="text-sm font-bold text-blue-900">
                                  {request.equipmentBrand || request.equipmentId?.brand || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border-2 border-violet-100 group-hover:border-violet-200 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg p-2.5 shadow-lg shadow-violet-500/30">
                                <Calendar className="w-5 h-5 text-white" />
                              </div>
                              <p className="font-bold text-gray-900 text-base">Rental Period</p>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-white/70 rounded-lg p-3">
                                <p className="text-xs text-violet-700 font-semibold mb-1">Start Date</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {formatDate(request.startDate)}
                                </p>
                              </div>
                              <div className="bg-white/70 rounded-lg p-3">
                                <p className="text-xs text-violet-700 font-semibold mb-1">End Date</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {formatDate(request.endDate)}
                                </p>
                              </div>
                              <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg p-3 text-center">
                                <p className="text-xs text-violet-100 font-semibold mb-1">Duration</p>
                                <p className="text-lg font-bold text-white">
                                  {request.totalDays || calculateDays(request.startDate, request.endDate)} days
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border-2 border-orange-100 group-hover:border-orange-200 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg p-2.5 shadow-lg shadow-orange-500/30">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <p className="font-bold text-gray-900 text-base">Delivery</p>
                            </div>
                            <div className="space-y-3">
                              <div className="bg-white/70 rounded-lg p-3">
                                <p className="text-xs text-orange-700 font-semibold mb-1">Method</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {request.deliveryMethod === "delivery"
                                    ? "Home Delivery"
                                    : "Self Pickup"}
                                </p>
                              </div>
                              <div className="bg-white/70 rounded-lg p-3">
                                <p className="text-xs text-orange-700 font-semibold mb-1">Quantity</p>
                                <p className="text-sm font-bold text-gray-900">{request.quantity || 1}</p>
                              </div>
                              {request.deliveryMethod === "delivery" && request.deliveryAddress && (
                                <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg p-3">
                                  <p className="text-xs text-orange-100 font-semibold mb-1">Delivery Address</p>
                                  <p className="text-xs font-medium text-white leading-relaxed">
                                    {request.deliveryAddress}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl p-8 shadow-2xl shadow-emerald-500/40 sticky top-6 border border-white/20">
                          <div className="text-center mb-8">
                            <p className="text-emerald-50 text-sm font-bold mb-3 uppercase tracking-wider">Total Amount</p>
                            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30">
                              <div className="flex items-center justify-center gap-1.5">
                                <IndianRupee className="w-8 h-8 text-white" />
                              <p className="text-5xl font-bold text-white tracking-tight">
                                {calculateTotalAmount(request).toLocaleString()}
                              </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                              onClick={() => handleApprove(request)}
                              className="w-full bg-white text-emerald-700 py-4 px-6 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                            >
                              <CheckCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                              Approve Request
                            </button>

                            <button
                              onClick={() => openRejectModal(request)}
                              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 px-6 rounded-xl font-bold hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
                            >
                              <XCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                              Reject Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                  <XCircle className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Reject Request</h3>
              </div>
            </div>

            <div className="p-8">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Please provide a reason for rejecting this booking request:
              </p>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g., Equipment not available for selected dates, maintenance scheduled..."
                rows={4}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all resize-none mb-6 text-gray-900 placeholder:text-gray-400"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                    setSelectedRequest(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                  className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 px-6 rounded-xl font-bold hover:from-red-600 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/30"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RenterDashboard;