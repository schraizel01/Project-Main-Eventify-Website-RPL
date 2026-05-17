const express = require('express');
const router = express.Router();
const { 
  getParticipants,
  exportParticipants
} = require('../controllers/participantController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getParticipants);
router.get('/export', authMiddleware, exportParticipants);

module.exports = router;
