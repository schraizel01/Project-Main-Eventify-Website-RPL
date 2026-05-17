const express = require('express');
const router = express.Router();
const { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  getDashboardStats
} = require('../controllers/eventController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin routes (Protected) - using a different prefix for dashboard
router.get('/admin/dashboard', authMiddleware, getDashboardStats);
router.post('/admin', authMiddleware, createEvent);
router.put('/admin/:id', authMiddleware, updateEvent);
router.delete('/admin/:id', authMiddleware, deleteEvent);

module.exports = router;
