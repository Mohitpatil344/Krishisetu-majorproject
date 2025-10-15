import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

// Helper function to get token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create booking
const createBooking = async (bookingData) => {
  try {
    const response = await axios.post(
      API_URL,
      bookingData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error.response?.data || error;
  }
};

// Get renter bookings
const getRenterBookings = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/my-bookings`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching renter bookings:", error);
    throw error.response?.data || error;
  }
};

// Get business bookings
const getBusinessBookings = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/business`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching business bookings:", error);
    throw error.response?.data || error;
  }
};

// Update booking status
const updateBookingStatus = async (id, status, rejectionReason = null) => {
  try {
    const payload = { status };
    
    // Add rejection reason if provided
    if (rejectionReason) {
      payload.rejectionReason = rejectionReason;
    }
    
    const response = await axios.patch(
      `${API_URL}/${id}/status`,
      payload,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error.response?.data || error;
  }
};

// Cancel booking
const cancelBooking = async (id) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}/cancel`,
      {},
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error.response?.data || error;
  }
};

// Get booking by ID
const getBookingById = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/${id}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error.response?.data || error;
  }
};

// Export as default object
const bookingService = {
  createBooking,
  getRenterBookings,
  getBusinessBookings,
  updateBookingStatus,
  cancelBooking,
  getBookingById,
};

export default bookingService;