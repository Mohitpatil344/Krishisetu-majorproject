const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class BookingService {
  async createBooking(bookingData) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error('Booking service error:', error);
      throw error;
    }
  }

  async getRenterBookings() {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Booking service error:', error);
      throw error;
    }
  }

  async updateBookingStatus(bookingId, status) {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update booking status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }
}

const bookingService = new BookingService();
export default bookingService;