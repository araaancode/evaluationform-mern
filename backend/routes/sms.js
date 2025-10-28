const express = require('express');
const router = express.Router();
const { 
  getTemplates, 
  updateTemplate, 
  sendSMS, 
  getSentMessages,
  getSMSStats 
} = require('../controllers/smsController');
const { protect, admin } = require('../middleware/auth');

router.get('/templates', protect, admin, getTemplates);
router.put('/templates/:id', protect, admin, updateTemplate);
router.post('/send', protect, admin, sendSMS);
router.get('/history', protect, admin, getSentMessages);
router.get('/stats', protect, admin, getSMSStats);

module.exports = router;