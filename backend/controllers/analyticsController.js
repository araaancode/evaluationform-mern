const Evaluation = require('../models/Evaluation');
const User = require('../models/User');

// @desc    Get comprehensive analytics
// @route   GET /api/analytics/overview
// @access  Private/Admin
exports.getOverview = async (req, res, next) => {
  try {
    // Basic counts
    const totalUsers = await User.countDocuments();
    const totalEvaluations = await Evaluation.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Today's stats
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday }
    });
    const evaluationsToday = await Evaluation.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    // Evaluation status distribution
    const evaluationStatus = await Evaluation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Brand distribution
    const brandDistribution = await Evaluation.aggregate([
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      }
    ]);

    // Education level distribution
    const educationDistribution = await Evaluation.aggregate([
      {
        $group: {
          _id: '$education.degree',
          count: { $sum: 1 }
        }
      }
    ]);

    // Immigration purpose distribution
    const purposeDistribution = await Evaluation.aggregate([
      {
        $group: {
          _id: '$immigration.purpose',
          count: { $sum: 1 }
        }
      }
    ]);

    // Language level distribution
    const languageDistribution = await Evaluation.aggregate([
      {
        $group: {
          _id: '$language.level',
          count: { $sum: 1 }
        }
      }
    ]);

    // Score statistics
    const scoreStats = await Evaluation.aggregate([
      {
        $match: { score: { $ne: null } }
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$score' },
          max: { $max: '$score' },
          min: { $min: '$score' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = await Evaluation.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Active users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalEvaluations,
          totalAdmins,
          newUsersToday,
          evaluationsToday,
          activeUsers
        },
        evaluationStatus: evaluationStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        brandDistribution: brandDistribution.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        educationDistribution: educationDistribution.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        purposeDistribution: purposeDistribution.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        languageDistribution: languageDistribution.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        scoreStats: scoreStats[0] || { average: 0, max: 0, min: 0, count: 0 },
        monthlyGrowth: monthlyGrowth.map(item => ({
          period: `${item._id.year}/${item._id.month}`,
          count: item.count
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get brand-specific analytics
// @route   GET /api/analytics/brands
// @access  Private/Admin
exports.getBrandAnalytics = async (req, res, next) => {
  try {
    const brands = ['azmoonland', 'faramohajerat', 'khodjosh'];
    const brandAnalytics = [];

    for (const brand of brands) {
      const totalEvaluations = await Evaluation.countDocuments({ brand });
      
      const statusStats = await Evaluation.aggregate([
        {
          $match: { brand }
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const monthlyStats = await Evaluation.aggregate([
        {
          $match: { 
            brand,
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 }
        }
      ]);

      const scoreStats = await Evaluation.aggregate([
        {
          $match: { 
            brand,
            score: { $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            average: { $avg: '$score' },
            max: { $max: '$score' },
            min: { $min: '$score' }
          }
        }
      ]);

      brandAnalytics.push({
        brand,
        totalEvaluations,
        statusStats: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        monthlyStats: monthlyStats.map(item => ({
          period: `${item._id.year}/${item._id.month}`,
          count: item.count
        })),
        scoreStats: scoreStats[0] || { average: 0, max: 0, min: 0 }
      });
    }

    res.json({
      success: true,
      data: brandAnalytics
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user engagement analytics
// @route   GET /api/analytics/engagement
// @access  Private/Admin
exports.getEngagementAnalytics = async (req, res, next) => {
  try {
    // User registration trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Evaluation completion rate
    const totalUsersWithEvaluations = await Evaluation.distinct('userId');
    const evaluationCompletionRate = (totalUsersWithEvaluations.length / await User.countDocuments()) * 100;

    // Active vs inactive users
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo }
    });
    const inactiveUsers = await User.countDocuments({
      $or: [
        { lastLogin: { $lt: thirtyDaysAgo } },
        { lastLogin: { $exists: false } }
      ]
    });

    // User evaluations distribution
    const userEvaluationsDist = await Evaluation.aggregate([
      {
        $group: {
          _id: '$userId',
          evaluationCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$evaluationCount',
          userCount: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        registrationTrend: registrationTrend.map(item => ({
          period: `${item._id.year}/${item._id.month}`,
          count: item.count
        })),
        engagement: {
          totalUsers: await User.countDocuments(),
          activeUsers,
          inactiveUsers,
          evaluationCompletionRate: Math.round(evaluationCompletionRate * 100) / 100
        },
        userEvaluationsDistribution: userEvaluationsDist.reduce((acc, curr) => {
          acc[curr._id] = curr.userCount;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get real-time dashboard data
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
exports.getDashboardData = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's stats
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday }
    });
    const evaluationsToday = await Evaluation.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    // This week's stats
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfWeek }
    });
    const evaluationsThisWeek = await Evaluation.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // This month's stats
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const evaluationsThisMonth = await Evaluation.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Pending evaluations
    const pendingEvaluations = await Evaluation.countDocuments({ status: 'pending' });

    // Recent activities
    const recentEvaluations = await Evaluation.find()
      .populate('userId', 'firstName lastName')
      .select('personalInfo brand status score createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    const recentUsers = await User.find()
      .select('firstName lastName phone createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(10);

    // Quick stats
    const totalUsers = await User.countDocuments();
    const totalEvaluations = await Evaluation.countDocuments();
    const completedEvaluations = await Evaluation.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      data: {
        quickStats: {
          totalUsers,
          totalEvaluations,
          completedEvaluations,
          pendingEvaluations,
          newUsersToday,
          evaluationsToday
        },
        periodStats: {
          today: { users: newUsersToday, evaluations: evaluationsToday },
          thisWeek: { users: newUsersThisWeek, evaluations: evaluationsThisWeek },
          thisMonth: { users: newUsersThisMonth, evaluations: evaluationsThisMonth }
        },
        recentActivities: {
          evaluations: recentEvaluations,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    next(error);
  }
};