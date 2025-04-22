import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, eventsResponse] = await Promise.all([
          axios.get('/api/users/me'),
          axios.get('/api/events/upcoming')
        ]);
        
        setUserData(userResponse.data);
        setUpcomingEvents(eventsResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {userData?.name}</h1>
        <p className="text-gray-600">Here's what's happening with your events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/events/create"
              className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create New Event
            </Link>
            <Link
              to="/bookings"
              className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              View My Bookings
            </Link>
            {userData?.role === 'organizer' && (
              <Link
                to="/events/manage"
                className="block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Manage Events
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {userData?.name}</p>
            <p><span className="font-semibold">Email:</span> {userData?.email}</p>
            <p><span className="font-semibold">Role:</span> {userData?.role}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Upcoming Events:</span> {upcomingEvents.length}</p>
            <p><span className="font-semibold">Total Bookings:</span> {userData?.totalBookings || 0}</p>
            {userData?.role === 'organizer' && (
              <p><span className="font-semibold">Events Created:</span> {userData?.eventsCreated || 0}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => (
              <div key={event._id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                <p className="text-gray-600">{event.location}</p>
                <Link
                  to={`/events/${event._id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No upcoming events</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 