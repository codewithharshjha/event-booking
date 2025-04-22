import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Dashboard from './pages/Dashboard';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
import ManageEvents from './pages/ManageEvents';
import EditEvent from './pages/EditEvent';
import NotFound from './pages/NotFound';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="main-container">Loading...</div>;
  
  return user ? children : <Navigate to="/login" />;
};

const OrganizerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="main-container">Loading...</div>;
  
  return user && (user.role === 'organizer' || user.role === 'admin') ? 
    children : 
    <Navigate to="/" />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="main-container">Loading...</div>;
  
  return !user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/bookings" element={
            <PrivateRoute>
              <MyBookings />
            </PrivateRoute>
          } />
          <Route path="/bookings/:id" element={
            <PrivateRoute>
              <BookingDetails />
            </PrivateRoute>
          } />
          
          {/* Organizer Routes */}
          <Route path="/events/create" element={
            <OrganizerRoute>
              <CreateEvent />
            </OrganizerRoute>
          } />
          <Route path="/events/manage" element={
            <OrganizerRoute>
              <ManageEvents />
            </OrganizerRoute>
          } />
          <Route path="/events/edit/:id" element={
            <OrganizerRoute>
              <EditEvent />
            </OrganizerRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;