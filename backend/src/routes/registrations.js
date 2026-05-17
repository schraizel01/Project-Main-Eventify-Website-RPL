const express = require('express');
const router = express.Router();
const { 
  registerForEvent, 
  getRegistrationsByEmail 
} = require('../controllers/registrationController');

router.post('/', registerForEvent);
router.get('/', getRegistrationsByEmail);

module.exports = router;
