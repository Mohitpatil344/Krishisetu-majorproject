
import React, { useState } from "react";
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
  MessageSquare,
  Edit3,
} from "lucide-react";

function RenterDashboard() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([
    {
      id: "REQ-2025-001",
      farmerName: "Rajesh Kumar",
      farmerContact: "+91 98765 43210",
      farmerAddress: "Village Rampur, Near Primary School, Tehsil Bilaspur, District Rampur, UP - 244901",
      equipmentName: "John Deere 5310 Tractor",
      equipmentBrand: "John Deere",
      startDate: "2025-10-15",
      endDate: "2025-10-22",
      quantity: 1,
      deliveryMethod: "delivery",
      deliveryAddress: "Village Rampur, Near Primary School, Tehsil Bilaspur, District Rampur, UP - 244901",
      totalAmount: 28500,
      additionalNotes: "Need for wheat harvesting. Please ensure equipment is serviced.",
      status: "pending",
    },
    {
      id: "REQ-2025-002",
      farmerName: "Amit Verma",
      farmerContact: "+91 87654 32109",
      farmerAddress: "Village Sitapur, District Sitapur, UP - 261001",
      equipmentName: "Rotavator 7ft",
      equipmentBrand: "Mahindra",
      startDate: "2025-10-18",
      endDate: "2025-10-20",
      quantity: 1,
      deliveryMethod: "pickup",
      totalAmount: 6000,
      status: "pending",
    },
  ]);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [rejectReason, setRejectReason] = useState("");
  const [counterOffer, setCounterOffer] = useState({
    startDate: "",
    endDate: "",
    price: "",
    notes: "",
  });

  const handleApprove = (request) => {
    // Update the request status
    setRequests(
      requests.map((r) =>
        r.id === request.id ? { ...r, status: "approved" } : r
      )
    );
    
    // Navigate to agreement page with state
    navigate('/agreement', { 
      state: { agreementData: request }
    });
  };

  const handleReject = () => {
    if (selectedRequest && rejectReason.trim()) {
      setRequests(
        requests.map((r) =>
          r.id === selectedRequest.id ? { ...r, status: "rejected", rejectReason } : r
        )
      );
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedRequest(null);
    }
  };

  const handleCounterOffer = () => {
    if (selectedRequest && counterOffer.startDate && counterOffer.endDate) {
      // Update the request with counter offer
      setRequests(
        requests.map((r) =>
          r.id === selectedRequest.id 
            ? { 
                ...r, 
                status: "counter_offered",
                counterOffer: counterOffer
              } 
            : r
        )
      );
      setShowCounterModal(false);
      setCounterOffer({ startDate: "", endDate: "", price: "", notes: "" });
      setSelectedRequest(null);
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const openCounterModal = (request) => {
    setSelectedRequest(request);
    setCounterOffer({
      startDate: request.startDate,
      endDate: request.endDate,
      price: request.totalAmount.toString(),
      notes: "",
    });
    setShowCounterModal(true);
  };

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Requests</h1>
          <p className="text-gray-600">Review and manage rental requests from farmers</p>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Requests</h3>
            <p className="text-gray-600">All booking requests have been processed</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-50 text-sm font-medium">Request ID</p>
                      <p className="text-white text-lg font-bold">{request.id}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <Clock className="w-5 h-5 text-white inline mr-2" />
                      <span className="text-white font-semibold">Pending Review</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="bg-green-100 rounded-xl p-3">
                            <User className="w-6 h-6 text-green-700" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">Farmer Details</p>
                            <p className="text-lg font-bold text-gray-900">{request.farmerName}</p>
                            <p className="text-sm text-gray-600">{request.farmerContact}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 rounded-xl p-3">
                            <Package className="w-6 h-6 text-blue-700" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-1">Equipment</p>
                            <p className="text-lg font-bold text-gray-900">{request.equipmentName}</p>
                            <p className="text-sm text-gray-600">{request.equipmentBrand}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <Calendar className="w-5 h-5 text-green-600" />
                            <p className="font-semibold text-gray-900">Rental Period</p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-600">Start Date</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(request.startDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">End Date</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(request.endDate)}
                              </p>
                            </div>
                            <div className="pt-2 border-t border-gray-300">
                              <p className="text-xs text-gray-600">Duration</p>
                              <p className="text-sm font-bold text-green-600">
                                {calculateDays(request.startDate, request.endDate)} days
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <MapPin className="w-5 h-5 text-green-600" />
                            <p className="font-semibold text-gray-900">Delivery</p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-600">Method</p>
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {request.deliveryMethod === "delivery"
                                  ? "Home Delivery"
                                  : "Self Pickup"}
                              </p>
                            </div>
                            {request.deliveryAddress && (
                              <div>
                                <p className="text-xs text-gray-600">Address</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {request.deliveryAddress}
                                </p>
                              </div>
                            )}
                            <div className="pt-2 border-t border-gray-300">
                              <p className="text-xs text-gray-600">Quantity</p>
                              <p className="text-sm font-bold text-gray-900">{request.quantity}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {request.additionalNotes && (
                        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-blue-900 mb-1">
                                Additional Notes
                              </p>
                              <p className="text-sm text-blue-800">{request.additionalNotes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-1">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 sticky top-6">
                        <div className="text-center mb-6">
                          <p className="text-sm text-green-700 mb-2">Total Amount</p>
                          <div className="flex items-center justify-center gap-1">
                            <IndianRupee className="w-7 h-7 text-green-700" />
                            <p className="text-4xl font-bold text-green-700">
                              {request.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => handleApprove(request)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Approve Request
                          </button>

                          <button
                            onClick={() => openCounterModal(request)}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <Edit3 className="w-5 h-5" />
                            Counter Offer
                          </button>

                          <button
                            onClick={() => openRejectModal(request)}
                            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
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

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-xl p-3">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Request</h3>
            </div>

            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this booking request:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g., Equipment not available for selected dates, maintenance scheduled..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all resize-none mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedRequest(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {showCounterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-xl p-3">
                <Edit3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Send Counter Offer</h3>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={counterOffer.startDate}
                    onChange={(e) =>
                      setCounterOffer({ ...counterOffer, startDate: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={counterOffer.endDate}
                    onChange={(e) =>
                      setCounterOffer({ ...counterOffer, endDate: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Revised Price (₹)
                </label>
                <input
                  type="number"
                  value={counterOffer.price}
                  onChange={(e) => setCounterOffer({ ...counterOffer, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                  Notes (Optional)
                </label>
                <textarea
                  value={counterOffer.notes}
                  onChange={(e) => setCounterOffer({ ...counterOffer, notes: e.target.value })}
                  placeholder="Add any additional notes for the farmer..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCounterModal(false);
                  setCounterOffer({ startDate: "", endDate: "", price: "", notes: "" });
                  setSelectedRequest(null);
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCounterOffer}
                disabled={!counterOffer.startDate || !counterOffer.endDate}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Counter Offer
              </button>
            </div>
          </div>
        </div>
      )}x
    </div>
  );
}

export default RenterDashboard;