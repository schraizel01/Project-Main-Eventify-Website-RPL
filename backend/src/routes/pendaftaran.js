const express = require('express');
const router = express.Router();
const { 
  registerForKegiatan, 
  getRiwayatByEmail 
} = require('../controllers/pendaftaranController');

router.post('/', registerForKegiatan);
router.get('/', getRiwayatByEmail);

module.exports = router;
