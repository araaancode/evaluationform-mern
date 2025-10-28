const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser, getUserStats } = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, admin, getUsers);
router.patch('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);
router.get('/stats', protect, admin, getUserStats);

module.exports = router;