const express = require('express');
const router = express.Router();
const { 
  getPeserta,
  exportPeserta
} = require('../controllers/pesertaController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getPeserta);
router.get('/export', authMiddleware, exportPeserta);

module.exports = router;
