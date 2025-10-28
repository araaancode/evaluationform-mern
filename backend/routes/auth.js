const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('firstName')
    .notEmpty()
    .withMessage('نام الزامی است')
    .isLength({ min: 2, max: 50 })
    .withMessage('نام باید بین ۲ تا ۵۰ کاراکتر باشد'),
  body('lastName')
    .notEmpty()
    .withMessage('نام خانوادگی الزامی است')
    .isLength({ min: 2, max: 50 })
    .withMessage('نام خانوادگی باید بین ۲ تا ۵۰ کاراکتر باشد'),
  body('phone')
    .matches(/^09[0-9]{9}$/)
    .withMessage('شماره تماس معتبر نیست'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('رمز عبور باید حداقل ۶ کاراکتر باشد')
];

const loginValidation = [
  body('phone')
    .matches(/^09[0-9]{9}$/)
    .withMessage('شماره تماس معتبر نیست'),
  body('password')
    .notEmpty()
    .withMessage('رمز عبور الزامی است')
];

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;