import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import SeatSelector from '../components/events/SeatSelector';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in to book tickets');
      navigate('/login');
      return;
    }

    if (selectedSeats.length === 0) {
      toast.warning('Please select at least one seat');
      return;
    }

    try {
      setIsBooking(true);
      
      const totalAmount = selectedSeats.length * event.ticketPrice;
      
      await axios.post('/api/bookings', {
        eventId: event._id,
        seats: selectedSeats,
        totalAmount
      });
      
      toast.success('Booking successful!');
      navigate('/bookings');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.msg || 'Failed to book tickets. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="main-container text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="main-container">
        <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded relative" role="alert">
          <p className="font-bold">Error</p>
          <p>{error || 'Event not found'}</p>
        </div>
      </div>
    );
  }

  const { 
    title, 
    description, 
    imageUrl, 
    date, 
    time, 
    location, 
    organizer, 
    ticketPrice, 
    totalSeats, 
    availableSeats, 
    category 
  } = event;

  const formattedDate = format(new Date(date), 'MMMM dd, yyyy');
  const isPastEvent = new Date(date) < new Date();
  const isSoldOut = availableSeats === 0;
  const isOrganizer = user && (organizer._id === user.id || user.role === 'admin');

  return (
    <div className="main-container">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Event Image */}
          <div className="relative h-64 md:h-80">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
                <span className="text-white text-3xl font-bold">{title.substring(0, 1)}</span>
              </div>
            )}
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary-600">
              {category}
            </div>
          </div>
          
          {/* Event Details */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-500 mb-4">Organized by {organizer.name}</p>
              </div>
              <div className="mt-4 md:mt-0 md:ml-6">
                <span className="text-2xl font-bold text-primary-600">${ticketPrice}</span>
                <span className="text-gray-500 ml-1">per ticket</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-6 w-6 text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500">Date</span>
                <span className="font-medium">{formattedDate}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-6 w-6 text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-500">Time</span>
                <span className="font-medium">{time}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                <svg className="h-6 w-6 text-gray-400 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-500">Location</span>
                <span className="font-medium">{location}</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{description}</p>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tickets</h2>
                <div className="text-sm text-gray-500">
                  {availableSeats} out of {totalSeats} available
                </div>
              </div>
              
              {/* Show seat selector for valid events */}
              {!isPastEvent && !isSoldOut && !isOrganizer && (
                <SeatSelector
                  totalSeats={totalSeats}
                  availableSeats={availableSeats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={setSelectedSeats}
                />
              )}
              
              {isPastEvent && (
                <div className="p-4 bg-gray-100 rounded-md text-gray-700">
                  This event has already taken place.
                </div>
              )}

              {isSoldOut && !isPastEvent && (
                <div className="p-4 bg-error-50 border border-error-100 rounded-md text-error-700">
                  This event is sold out.
                </div>
              )}
              
              {isOrganizer && (
                <div className="p-4 bg-primary-50 border border-primary-100 rounded-md text-primary-700">
                  You are the organizer of this event. You cannot book tickets for your own event.
                </div>
              )}
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                {!isPastEvent && !isSoldOut && !isOrganizer && (
                  <button
                    onClick={handleBooking}
                    disabled={selectedSeats.length === 0 || isBooking}
                    className={`btn-primary flex-1 py-3 flex items-center justify-center ${
                      selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isBooking ? 'Processing...' : `Book ${selectedSeats.length} Ticket${selectedSeats.length !== 1 ? 's' : ''}`}
                  </button>
                )}
                
                {isOrganizer && (
                  <button
                    onClick={() => navigate(`/events/edit/${id}`)}
                    className="btn-outline flex-1 py-3"
                  >
                    Edit Event
                  </button>
                )}
                
                <button
                  onClick={() => navigate(-1)}
                  className="btn-outline flex-1 py-3"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;