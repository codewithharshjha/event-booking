import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`/api/bookings/${id}`);
        navigate('/bookings');
      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Booking Not Found</h1>
        <button
          onClick={() => navigate('/bookings')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to My Bookings
        </button>
      </div>
    );
  }
console.log('from bookingdata',booking)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to My Bookings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{booking.event.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Event Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Date:</span> {new Date(booking.event.date).toLocaleDateString()}</p>
                <p><span className="font-semibold">Time:</span> {booking.event.time}</p>
                <p><span className="font-semibold">Location:</span> {booking.event.location}</p>
                <p><span className="font-semibold">Category:</span> {booking.event.category}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Booking Information</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Booking ID:</span> {booking._id}</p>
                <p><span className="font-semibold">Status:</span> {booking.status}</p>
                <p><span className="font-semibold">Tickets:</span> {booking.tickets}</p>
                <p><span className="font-semibold">Total Price:</span> ${booking.totalAmount}</p>
                <p><span className="font-semibold">Booked On:</span> {new Date(booking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Event Description</h3>
            <p className="text-gray-600">{booking.event.description}</p>
          </div>

          {booking.status === 'pending' && (
            <div className="flex justify-end">
              <button
                onClick={handleCancelBooking}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel Booking
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your booking, please contact our support team.
          </p>
          <button
            onClick={() => window.location.href = 'mailto:support@eventbooking.com'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 