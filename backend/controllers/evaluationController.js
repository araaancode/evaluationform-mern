const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendSMS } = require('../utils/smsUtils');

// @desc    Create new evaluation
// @route   POST /api/evaluations
// @access  Private
exports.createEvaluation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add user ID to evaluation data
    const evaluationData = {
      ...req.body,
      userId: req.user.id
    };

    // Calculate score
    const evaluation = await Evaluation.create(evaluationData);
    evaluation.score = evaluation.calculateScore();
    await evaluation.save();

    // Send welcome SMS
    try {
      await sendSMS({
        to: evaluation.personalInfo.phone,
        template: 'WELCOME',
        variables: {
          firstName: evaluation.personalInfo.firstName,
          lastName: evaluation.personalInfo.lastName
        }
      });

      // Record SMS sent
      evaluation.smsSent.push({
        template: 'WELCOME',
        status: 'sent'
      });
      await evaluation.save();
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      // Continue even if SMS fails
    }

    // Send notification to admin (simulated)
    try {
      const admins = await User.find({ role: 'admin' });
      for (const admin of admins) {
        await sendSMS({
          to: admin.phone,
          template: 'NEW_EVALUATION',
          variables: {
            firstName: evaluation.personalInfo.firstName,
            lastName: evaluation.personalInfo.lastName,
            brand: evaluation.brand
          }
        });
      }
    } catch (notificationError) {
      console.error('Admin notification failed:', notificationError);
    }

    res.status(201).json({
      success: true,
      message: 'ارزیابی با موفقیت ثبت شد',
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's evaluations
// @route   GET /api/evaluations/my-evaluations
// @access  Private
exports.getUserEvaluations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const status = req.query.status || '';
    
    let query = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const evaluations = await Evaluation.find(query)
      .select('-adminNotes -smsSent')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Evaluation.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      count: evaluations.length,
      total,
      totalPages,
      currentPage: page,
      data: evaluations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single evaluation
// @route   GET /api/evaluations/:id
// @access  Private
exports.getEvaluationById = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'ارزیابی یافت نشد'
      });
    }

    // Check if user owns the evaluation or is admin
    if (evaluation.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'دسترسی غیرمجاز به این ارزیابی'
      });
    }

    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all evaluations (Admin)
// @route   GET /api/evaluations/admin/all
// @access  Private/Admin
exports.getAllEvaluations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || '';
    const status = req.query.status || '';
    const brand = req.query.brand || '';
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (brand) {
      query.brand = brand;
    }

    const evaluations = await Evaluation.find(query)
      .populate('userId', 'firstName lastName phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Evaluation.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      count: evaluations.length,
      total,
      totalPages,
      currentPage: page,
      data: evaluations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update evaluation status (Admin)
// @route   PATCH /api/evaluations/admin/:id
// @access  Private/Admin
exports.updateEvaluationStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;

    if (!['pending', 'under_review', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'وضعیت نامعتبر است'
      });
    }

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'ارزیابی یافت نشد'
      });
    }

    // Add admin note if provided
    if (adminNote) {
      evaluation.adminNotes.push({
        note: adminNote,
        adminId: req.user.id
      });
    }

    evaluation.status = status;
    await evaluation.save();

    // Send status update SMS
    try {
      await sendSMS({
        to: evaluation.personalInfo.phone,
        template: 'STATUS_UPDATE',
        variables: {
          firstName: evaluation.personalInfo.firstName,
          status: getStatusText(status)
        }
      });

      evaluation.smsSent.push({
        template: 'STATUS_UPDATE',
        status: 'sent'
      });
      await evaluation.save();
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
    }

    res.json({
      success: true,
      message: 'وضعیت ارزیابی با موفقیت به‌روزرسانی شد',
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add admin note to evaluation
// @route   POST /api/evaluations/admin/:id/notes
// @access  Private/Admin
exports.addAdminNote = async (req, res, next) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'متن یادداشت الزامی است'
      });
    }

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'ارزیابی یافت نشد'
      });
    }

    evaluation.adminNotes.push({
      note,
      adminId: req.user.id
    });

    await evaluation.save();

    res.json({
      success: true,
      message: 'یادداشت با موفقیت اضافه شد',
      data: evaluation
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get evaluation statistics
// @route   GET /api/evaluations/stats/overview
// @access  Private/Admin
exports.getEvaluationStats = async (req, res, next) => {
  try {
    const totalEvaluations = await Evaluation.countDocuments();
    
    const statusStats = await Evaluation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const brandStats = await Evaluation.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      }
    ]);

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const evaluationsToday = await Evaluation.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const evaluationsLast7Days = await Evaluation.countDocuments({
      createdAt: { $gte: last7Days }
    });

    // Average score
    const scoreStats = await Evaluation.aggregate([
      {
        $match: { score: { $ne: null } }
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          maxScore: { $max: '$score' },
          minScore: { $min: '$score' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalEvaluations,
        evaluationsToday,
        evaluationsLast7Days,
        statusStats: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        brandStats: brandStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        scoreStats: scoreStats[0] || { averageScore: 0, maxScore: 0, minScore: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to get status text
function getStatusText(status) {
  const statusMap = {
    'pending': 'در انتظار بررسی',
    'under_review': 'در حال بررسی',
    'completed': 'تکمیل شده',
    'rejected': 'رد شده'
  };
  return statusMap[status] || status;
}