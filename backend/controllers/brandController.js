const Brand = require('../models/Brand');

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({ isActive: true })
      .select('-config -__v')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: brands.length,
      data: brands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
exports.getBrandById = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'برند یافت نشد'
      });
    }

    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create brand (Admin)
// @route   POST /api/brands
// @access  Private/Admin
exports.createBrand = async (req, res, next) => {
  try {
    const brand = await Brand.create(req.body);

    res.status(201).json({
      success: true,
      message: 'برند با موفقیت ایجاد شد',
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update brand (Admin)
// @route   PUT /api/brands/:id
// @access  Private/Admin
exports.updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'برند یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'برند با موفقیت به‌روزرسانی شد',
      data: brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete brand (Admin)
// @route   DELETE /api/brands/:id
// @access  Private/Admin
exports.deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'برند یافت نشد'
      });
    }

    // Check if brand has evaluations
    const Evaluation = require('../models/Evaluation');
    const evaluationsCount = await Evaluation.countDocuments({ brand: brand.code.toLowerCase() });
    
    if (evaluationsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'امکان حذف برند دارای ارزیابی وجود ندارد'
      });
    }

    await Brand.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'برند با موفقیت حذف شد',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get brand statistics
// @route   GET /api/brands/:id/stats
// @access  Private/Admin
exports.getBrandStats = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'برند یافت نشد'
      });
    }

    const Evaluation = require('../models/Evaluation');
    
    const totalEvaluations = await Evaluation.countDocuments({ brand: brand.code.toLowerCase() });
    
    const statusStats = await Evaluation.aggregate([
      {
        $match: { brand: brand.code.toLowerCase() }
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
          brand: brand.code.toLowerCase(),
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

    res.json({
      success: true,
      data: {
        brand: brand.name,
        totalEvaluations,
        statusStats: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};