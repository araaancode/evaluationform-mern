// controllers/evaluationController.js
exports.createEvaluation = async (req, res) => {
  try {
    const evaluationData = {
      ...req.body,
      userId: req.userId,
      brand: req.headers.brand || 'default'
    };

    const evaluation = await Evaluation.create(evaluationData);
    
    // ارسال پیامک به کاربر
    await sendSMSToUser(req.body.phone, 'thankYou');
    
    // ارسال پیامک به ادمین
    await sendSMSToAdmin('newEvaluation');
    
    res.status(201).json({
      success: true,
      data: evaluation,
      message: 'ارزیابی با موفقیت ثبت شد'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getUserEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ userId: req.userId });
    res.json({ success: true, data: evaluations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};