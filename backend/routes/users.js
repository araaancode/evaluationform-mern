const express = require('express');
const {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getUserStats,
  deactivateUser,
  activateUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin only
router.use(protect, admin);

router.get('/', getUsers);
router.get('/stats', getUserStats);
router.get('/:id', getUser);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/deactivate', deactivateUser);
router.patch('/:id/activate', activateUser);
router.delete('/:id', deleteUser);

module.exports = router;