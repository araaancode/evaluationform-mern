// controllers/smsController.js
const sendSMSToUser = async (phone, template) => {
  const messages = {
    thankYou: `سپاس از اعتماد شما به فرامهاجرت 🌟
ارزیابی شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.`
  };

  // استفاده از سرویس پیامک (کاوه نگار، مدیار، ...)
  await fetch('https://api.sms-service.com/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SMS_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      to: phone,
      message: messages[template]
    })
  });
};