import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BookingCard = ({ booking }) => {
  const { _id, event, seats, totalAmount, bookingDate, status } = booking;

  // Format dates
  const formattedBookingDate = format(new Date(bookingDate), 'MMM dd, yyyy');
  const formattedEventDate = event?.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'N/A';

  // Get status badge color
  const getStatusBadgeClass = () => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-100 text-success-800';
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'cancelled':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {event?.title || 'Event Unavailable'}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass()}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-1.5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Event Date</p>
              <p>{formattedEventDate}</p>
            </div>
          </div>

          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-1.5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p>{event?.location || 'N/A'}</p>
            </div>
          </div>

          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-1.5 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">Booking Details</p>
              <p>Booked on: {formattedBookingDate}</p>
              <p>Seats: {seats.map(seat => seat.seatNumber).join(', ')}</p>
              <p className="font-medium text-primary-600">Total: ${totalAmount}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between">
          <Link 
            to={`/bookings/${_id}`} 
            className="text-primary-600 hover:text-primary-800 font-medium text-sm"
          >
            View Details
          </Link>
          {event?._id && (
            <Link 
              to={`/events/${event._id}`} 
              className="text-primary-600 hover:text-primary-800 font-medium text-sm"
            >
              View Event
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;