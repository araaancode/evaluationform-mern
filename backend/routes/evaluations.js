const express = require('express');
const { body } = require('express-validator');
const {
  createEvaluation,
  getUserEvaluations,
  getEvaluationById,
  getAllEvaluations,
  updateEvaluationStatus,
  addAdminNote,
  getEvaluationStats
} = require('../controllers/evaluationController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const evaluationValidation = [
  body('personalInfo.firstName')
    .notEmpty()
    .withMessage('نام الزامی است'),
  body('personalInfo.lastName')
    .notEmpty()
    .withMessage('نام خانوادگی الزامی است'),
  body('personalInfo.phone')
    .matches(/^09[0-9]{9}$/)
    .withMessage('شماره تماس معتبر نیست'),
  body('brand')
    .isIn(['azmoonland', 'faramohajerat', 'khodjosh'])
    .withMessage('برند معتبر نیست')
];

// User routes
router.post('/', protect, evaluationValidation, createEvaluation);
router.get('/my-evaluations', protect, getUserEvaluations);
router.get('/:id', protect, getEvaluationById);

// Admin routes
router.get('/admin/all', protect, admin, getAllEvaluations);
router.patch('/admin/:id', protect, admin, updateEvaluationStatus);
router.post('/admin/:id/notes', protect, admin, addAdminNote);
router.get('/stats/overview', protect, admin, getEvaluationStats);

module.exports = router;