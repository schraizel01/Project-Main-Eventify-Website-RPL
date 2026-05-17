const express = require('express');
const router = express.Router();
const { 
  getAllKegiatan, 
  getKegiatanById, 
  createKegiatan, 
  updateKegiatan, 
  deleteKegiatan,
  getDashboardStats
} = require('../controllers/kegiatanController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllKegiatan);
router.get('/:id', getKegiatanById);

// Admin routes (Protected)
router.get('/admin/dashboard', authMiddleware, getDashboardStats);
router.post('/admin', authMiddleware, createKegiatan);
router.put('/admin/:id', authMiddleware, updateKegiatan);
router.delete('/admin/:id', authMiddleware, deleteKegiatan);

module.exports = router;
