const express = require('express');
const {
  getOverview,
  getBrandAnalytics,
  getEngagementAnalytics,
  getDashboardData
} = require('../controllers/analyticsController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin only
router.use(protect, admin);

router.get('/overview', getOverview);
router.get('/brands', getBrandAnalytics);
router.get('/engagement', getEngagementAnalytics);
router.get('/dashboard', getDashboardData);

module.exports = router;