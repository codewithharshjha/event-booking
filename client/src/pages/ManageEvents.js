import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events/my-events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/events/${eventId}`);
        setEvents(events.filter(event => event._id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Link
          to="/events/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Event
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white rounded-lg shadow p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-2">{event.description.substring(0, 100)}...</p>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    <span className="font-semibold">Date:</span> {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Time:</span> {event.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Capacity:</span> {event.capacity}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Price:</span> ${event.price}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Status:</span> {event.status}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Link
                  to={`/events/edit/${event._id}`}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </Link>
                <Link
                  to={`/events/${event._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View
                </Link>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg mb-4">You haven't created any events yet.</p>
          <Link
            to="/events/create"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Create Your First Event
          </Link>
        </div>
      )}
    </div>
  );
};

export default ManageEvents; 