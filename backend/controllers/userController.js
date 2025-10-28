const User = require('../models/User');
const Evaluation = require('../models/Evaluation');
const { validationResult } = require('express-validator');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || '';
    const role = req.query.role || '';
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get evaluations count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const evaluationsCount = await Evaluation.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          evaluationsCount
        };
      })
    );

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages,
      currentPage: page,
      data: usersWithStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Get user evaluations
    const evaluations = await Evaluation.find({ userId: user._id })
      .select('brand status score createdAt')
      .sort({ createdAt: -1 });

    const userWithEvaluations = {
      ...user.toObject(),
      evaluations,
      evaluationsCount: evaluations.length
    };

    res.json({
      success: true,
      data: userWithEvaluations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'نقش کاربر باید user یا admin باشد'
      });
    }

    // Prevent admin from changing their own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توانید نقش خود را تغییر دهید'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'نقش کاربر با موفقیت به‌روزرسانی شد',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توانید حساب کاربری خود را حذف کنید'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Check if user has evaluations
    const evaluationsCount = await Evaluation.countDocuments({ userId: user._id });
    
    if (evaluationsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'امکان حذف کاربر دارای ارزیابی وجود ندارد'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'کاربر با موفقیت حذف شد',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });
    
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    // Users with evaluations
    const usersWithEvaluations = await Evaluation.distinct('userId');
    const usersWithEvaluationsCount = usersWithEvaluations.length;

    // Active users (logged in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalRegularUsers,
        newUsersToday,
        usersWithEvaluationsCount,
        activeUsers,
        usersWithoutEvaluations: totalRegularUsers - usersWithEvaluationsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deactivate user
// @route   PATCH /api/users/:id/deactivate
// @access  Private/Admin
exports.deactivateUser = async (req, res, next) => {
  try {
    // Prevent admin from deactivating themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توانید حساب کاربری خود را غیرفعال کنید'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'کاربر با موفقیت غیرفعال شد',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate user
// @route   PATCH /api/users/:id/activate
// @access  Private/Admin
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'کاربر با موفقیت فعال شد',
      data: user
    });
  } catch (error) {
    next(error);
  }
};