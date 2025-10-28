const express = require('express');
const {
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  sendSMS,
  sendBulkSMS,
  getSentMessages,
  getSMSStats,
  initializeTemplates
} = require('../controllers/smsController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin only
router.use(protect, admin);

// Template management
router.get('/templates', getTemplates);
router.get('/templates/:id', getTemplate);
router.post('/templates', createTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

// SMS sending
router.post('/send', sendSMS);
router.post('/send-bulk', sendBulkSMS);

// History and stats
router.get('/history', getSentMessages);
router.get('/stats', getSMSStats);

// Initialization
router.post('/initialize-templates', initializeTemplates);

module.exports = router;