const express = require('express');
const router = express.Router();
const { 
  createEvaluation, 
  getUserEvaluations, 
  getEvaluationById,
  getAllEvaluations,
  updateEvaluationStatus 
} = require('../controllers/evaluationController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createEvaluation);
router.get('/my-evaluations', protect, getUserEvaluations);
router.get('/:id', protect, getEvaluationById);

// Routes ادمین
router.get('/admin/all', protect, admin, getAllEvaluations);
router.patch('/admin/:id', protect, admin, updateEvaluationStatus);

module.exports = router;