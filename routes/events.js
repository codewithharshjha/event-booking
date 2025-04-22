const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @route   POST api/events
// @desc    Create a new event
// @access  Private (only organizers and admins)
router.post('/createevent', auth, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'organizer' && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to create events' });
    }
    
    const {
      title,
      description,
      date,
      time,
      location,
      price,
      capacity,
      category
    } = req.body;
    
    if (!title || !description || !date || !time || !location || !price || !capacity || !category) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newEvent = new Event({
      title,
      description,
      imageUrl,
      date,
      time,
      location,
      organizer: req.user.id,
      ticketPrice: price,
      totalSeats: capacity,
      availableSeats: capacity,
      category
    });
    
    const event = await newEvent.save();
    
    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ msg: 'File size too large. Maximum size is 5MB' });
    }
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/events
// @desc    Get all events with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log("from query",req.query)
    const { category, search } = req.query;
    
    // Build the query object
    const query = {};
    
    // Add category filter if provided
    if (category && category !== '') {
      query.category = category;
    }
    
    // Add search filter if provided
    if (search && search !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    
    const events = await Event.find(query)
      .sort({ date: 1 })
      .populate('organizer', ['name', 'email']);
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', ['name', 'email']);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private (only event organizer or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if user is event organizer or admin
    const user = await User.findById(req.user.id);
    
    if (event.organizer.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to update this event' });
    }
    
    // Update fields
    const updatedFields = {};
    
    for (const [key, value] of Object.entries(req.body)) {
      if (key !== 'organizer' && key !== '_id') {
        updatedFields[key] = value;
      }
    }
    
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    ).populate('organizer', ['name', 'email']);
    
    res.json(updatedEvent);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private (only event organizer or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }
    
    // Check if user is event organizer or admin
    const user = await User.findById(req.user.id);
    
    if (event.organizer.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized to delete this event' });
    }
    
    await Event.findByIdAndRemove(req.params.id);
    
    res.json({ msg: 'Event removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Event not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   GET api/events/category/:category
// @desc    Get events by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const events = await Event.find({ category: req.params.category })
      .sort({ date: 1 })
      .populate('organizer', ['name', 'email']);
    
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;