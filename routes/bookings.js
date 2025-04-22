const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, seats, totalAmount } = req.body;

    // Check if event exists
    console.log('from booking',typeof(eventId))
    const event = await Event.findById(eventId);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if enough seats are available
    if (seats.length > event.availableSeats) {
      return res.status(400).json({ msg: 'Not enough seats available' });
    }
    
    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      event: eventId,
      seats,
      totalAmount,
      status: 'confirmed' // Assuming payment is processed successfully
    });
    
    const booking = await newBooking.save();
    
    // Update available seats in event
    event.availableSeats -= seats.length;
    await event.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings
// @desc    Get all bookings for current user
// @access  Private
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .sort({ bookingDate: -1 })
      .populate('event', ['title', 'date', 'time', 'location'])
      .populate('user', ['name', 'email']);
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', ['title', 'date', 'time', 'location', 'imageUrl'])
      .populate('user', ['name', 'email']);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if user owns this booking or is admin
    const user = await User.findById(req.user.id);
    
    if (booking.user._id.toString() !== req.user.id && user.role !== 'admin') {
      console.log("from user booking")
      return res.status(403).json({ msg: 'Not authorized to view this booking' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if user owns this booking or is admin
    const user = await User.findById(req.user.id);
    
    if (booking.user.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to cancel this booking' });
    }
    
    // Check if already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking is already cancelled' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Update available seats in event
    const event = await Event.findById(booking.event);
    event.availableSeats += booking.seats.length;
    await event.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/event/:eventId
// @desc    Get all bookings for an event (organizer only)
// @access  Private
router.get('/event/:eventId', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if user is organizer or admin
    const user = await User.findById(req.user.id);
    
    if (event.organizer.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to view these bookings' });
    }
    
    const bookings = await Booking.find({ event: req.params.eventId })
      .sort({ bookingDate: -1 })
      .populate('user', ['name', 'email']);
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;