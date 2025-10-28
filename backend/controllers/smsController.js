const SMSTemplate = require('../models/SMSTemplate');
const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const { sendSMS, initializeDefaultTemplates } = require('../utils/smsUtils');

// @desc    Get all SMS templates
// @route   GET /api/sms/templates
// @access  Private/Admin
exports.getTemplates = async (req, res, next) => {
  try {
    const templates = await SMSTemplate.find()
      .sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single SMS template
// @route   GET /api/sms/templates/:id
// @access  Private/Admin
exports.getTemplate = async (req, res, next) => {
  try {
    const template = await SMSTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'تمپلیت پیامک یافت نشد'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create SMS template
// @route   POST /api/sms/templates
// @access  Private/Admin
exports.createTemplate = async (req, res, next) => {
  try {
    const template = await SMSTemplate.create(req.body);

    res.status(201).json({
      success: true,
      message: 'تمپلیت پیامک با موفقیت ایجاد شد',
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update SMS template
// @route   PUT /api/sms/templates/:id
// @access  Private/Admin
exports.updateTemplate = async (req, res, next) => {
  try {
    const template = await SMSTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'تمپلیت پیامک یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'تمپلیت پیامک با موفقیت به‌روزرسانی شد',
      data: template
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete SMS template
// @route   DELETE /api/sms/templates/:id
// @access  Private/Admin
exports.deleteTemplate = async (req, res, next) => {
  try {
    const template = await SMSTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'تمپلیت پیامک یافت نشد'
      });
    }

    await SMSTemplate.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'تمپلیت پیامک با موفقیت حذف شد',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send SMS
// @route   POST /api/sms/send
// @access  Private/Admin
exports.sendSMS = async (req, res, next) => {
  try {
    const { to, template, variables, evaluationId, userId } = req.body;

    if (!to && !evaluationId && !userId) {
      return res.status(400).json({
        success: false,
        message: 'گیرنده پیامک باید مشخص شود'
      });
    }

    let recipients = [];

    // Determine recipients
    if (to) {
      recipients.push({ phone: to, type: 'direct' });
    }

    if (evaluationId) {
      const evaluation = await Evaluation.findById(evaluationId);
      if (evaluation) {
        recipients.push({ 
          phone: evaluation.personalInfo.phone, 
          type: 'evaluation',
          evaluationId,
          firstName: evaluation.personalInfo.firstName,
          lastName: evaluation.personalInfo.lastName
        });
      }
    }

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        recipients.push({ 
          phone: user.phone, 
          type: 'user',
          userId,
          firstName: user.firstName,
          lastName: user.lastName
        });
      }
    }

    if (recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'هیچ گیرنده‌ای یافت نشد'
      });
    }

    const results = [];
    const failedSends = [];

    // Send SMS to each recipient
    for (const recipient of recipients) {
      try {
        const result = await sendSMS({
          to: recipient.phone,
          template,
          variables: {
            ...variables,
            firstName: recipient.firstName,
            lastName: recipient.lastName
          }
        });

        results.push({
          phone: recipient.phone,
          type: recipient.type,
          success: true,
          messageId: result.messageId
        });

        // Record in evaluation if applicable
        if (recipient.evaluationId) {
          await Evaluation.findByIdAndUpdate(recipient.evaluationId, {
            $push: {
              smsSent: {
                template,
                status: 'sent',
                sentAt: new Date()
              }
            }
          });
        }

      } catch (error) {
        failedSends.push({
          phone: recipient.phone,
          type: recipient.type,
          error: error.message
        });

        results.push({
          phone: recipient.phone,
          type: recipient.type,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `پیامک به ${successCount} نفر ارسال شد${failCount > 0 ? ` و ${failCount} نفر ناموفق بود` : ''}`,
      data: {
        total: results.length,
        success: successCount,
        failed: failCount,
        results
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send bulk SMS to multiple users
// @route   POST /api/sms/send-bulk
// @access  Private/Admin
exports.sendBulkSMS = async (req, res, next) => {
  try {
    const { userIds, evaluationIds, template, variables, filters } = req.body;

    let recipients = [];

    // Get users by IDs
    if (userIds && userIds.length > 0) {
      const users = await User.find({ _id: { $in: userIds } });
      recipients.push(...users.map(user => ({
        phone: user.phone,
        type: 'user',
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      })));
    }

    // Get evaluations by IDs
    if (evaluationIds && evaluationIds.length > 0) {
      const evaluations = await Evaluation.find({ _id: { $in: evaluationIds } });
      recipients.push(...evaluations.map(evaluation => ({
        phone: evaluation.personalInfo.phone,
        type: 'evaluation',
        evaluationId: evaluation._id,
        firstName: evaluation.personalInfo.firstName,
        lastName: evaluation.personalInfo.lastName
      })));
    }

    // Get users/evaluations by filters
    if (filters) {
      if (filters.userRole) {
        const users = await User.find({ role: filters.userRole });
        recipients.push(...users.map(user => ({
          phone: user.phone,
          type: 'user',
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName
        })));
      }

      if (filters.evaluationStatus) {
        const evaluations = await Evaluation.find({ status: filters.evaluationStatus });
        recipients.push(...evaluations.map(evaluation => ({
          phone: evaluation.personalInfo.phone,
          type: 'evaluation',
          evaluationId: evaluation._id,
          firstName: evaluation.personalInfo.firstName,
          lastName: evaluation.personalInfo.lastName
        })));
      }

      if (filters.evaluationBrand) {
        const evaluations = await Evaluation.find({ brand: filters.evaluationBrand });
        recipients.push(...evaluations.map(evaluation => ({
          phone: evaluation.personalInfo.phone,
          type: 'evaluation',
          evaluationId: evaluation._id,
          firstName: evaluation.personalInfo.firstName,
          lastName: evaluation.personalInfo.lastName
        })));
      }
    }

    // Remove duplicates based on phone number
    const uniqueRecipients = recipients.filter((recipient, index, self) =>
      index === self.findIndex(r => r.phone === recipient.phone)
    );

    if (uniqueRecipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'هیچ گیرنده‌ای یافت نشد'
      });
    }

    const results = [];

    // Send SMS to each unique recipient
    for (const recipient of uniqueRecipients) {
      try {
        const result = await sendSMS({
          to: recipient.phone,
          template,
          variables: {
            ...variables,
            firstName: recipient.firstName,
            lastName: recipient.lastName
          }
        });

        results.push({
          phone: recipient.phone,
          type: recipient.type,
          success: true,
          messageId: result.messageId
        });

      } catch (error) {
        results.push({
          phone: recipient.phone,
          type: recipient.type,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    res.json({
      success: true,
      message: `پیامک به ${successCount} نفر ارسال شد${failCount > 0 ? ` و ${failCount} نفر ناموفق بود` : ''}`,
      data: {
        total: uniqueRecipients.length,
        success: successCount,
        failed: failCount,
        results
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get SMS history
// @route   GET /api/sms/history
// @access  Private/Admin
exports.getSentMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // In a real implementation, you would have an SMSLog model
    // For now, we'll simulate with evaluation SMS history
    const evaluations = await Evaluation.find({ 'smsSent.0': { $exists: true } })
      .select('personalInfo smsSent brand createdAt')
      .sort({ 'smsSent.sentAt': -1 })
      .skip(skip)
      .limit(limit);

    const smsHistory = [];
    evaluations.forEach(evaluation => {
      evaluation.smsSent.forEach(sms => {
        smsHistory.push({
          id: `${evaluation._id}-${sms.sentAt.getTime()}`,
          phone: evaluation.personalInfo.phone,
          name: `${evaluation.personalInfo.firstName} ${evaluation.personalInfo.lastName}`,
          template: sms.template,
          status: sms.status,
          sentAt: sms.sentAt,
          brand: evaluation.brand,
          evaluationId: evaluation._id
        });
      });
    });

    // Sort by sentAt descending
    smsHistory.sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt));

    const total = smsHistory.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedHistory = smsHistory.slice(skip, skip + limit);

    res.json({
      success: true,
      count: paginatedHistory.length,
      total,
      totalPages,
      currentPage: page,
      data: paginatedHistory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get SMS statistics
// @route   GET /api/sms/stats
// @access  Private/Admin
exports.getSMSStats = async (req, res, next) => {
  try {
    // Get total SMS sent from evaluations
    const evaluations = await Evaluation.aggregate([
      { $unwind: '$smsSent' },
      {
        $group: {
          _id: null,
          totalSMS: { $sum: 1 },
          uniqueUsers: { $addToSet: '$personalInfo.phone' }
        }
      }
    ]);

    // Get SMS by template
    const smsByTemplate = await Evaluation.aggregate([
      { $unwind: '$smsSent' },
      {
        $group: {
          _id: '$smsSent.template',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get SMS by brand
    const smsByBrand = await Evaluation.aggregate([
      { $unwind: '$smsSent' },
      {
        $group: {
          _id: '$brand',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get SMS by month
    const smsByMonth = await Evaluation.aggregate([
      { $unwind: '$smsSent' },
      {
        $group: {
          _id: {
            year: { $year: '$smsSent.sentAt' },
            month: { $month: '$smsSent.sentAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const totalStats = evaluations[0] || { totalSMS: 0, uniqueUsers: [] };
    const uniqueUsersCount = totalStats.uniqueUsers ? totalStats.uniqueUsers.length : 0;

    // Calculate estimated cost (assuming 250 tomans per SMS)
    const estimatedCost = totalStats.totalSMS * 250;

    res.json({
      success: true,
      data: {
        totalSMS: totalStats.totalSMS || 0,
        uniqueUsers: uniqueUsersCount,
        estimatedCost,
        byTemplate: smsByTemplate.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byBrand: smsByBrand.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        byMonth: smsByMonth
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize default SMS templates
// @route   POST /api/sms/initialize-templates
// @access  Private/Admin
exports.initializeTemplates = async (req, res, next) => {
  try {
    await initializeDefaultTemplates();

    const templates = await SMSTemplate.find();

    res.json({
      success: true,
      message: 'تمپلیت‌های پیش‌فرض با موفقیت ایجاد شدند',
      data: templates
    });
  } catch (error) {
    next(error);
  }
};