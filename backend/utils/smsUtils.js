const SMSTemplate = require('../models/SMSTemplate');

// SMS Provider configurations
const providers = {
  console: {
    send: async (messageData) => {
      console.log('📱 SMS Sent (Console):', {
        to: messageData.to,
        message: messageData.message,
        template: messageData.template
      });
      return { success: true, messageId: `console-${Date.now()}` };
    }
  },
  kavenegar: {
    send: async (messageData) => {
      // This would integrate with Kavenegar API
      console.log('📱 SMS Sent (Kavenegar):', messageData);
      return { success: true, messageId: `kavenegar-${Date.now()}` };
    }
  }
};

// Compile message with variables
const compileMessage = (template, variables = {}) => {
  let message = template.content;
  
  Object.keys(variables).forEach(key => {
    const placeholder = `{${key}}`;
    message = message.replace(new RegExp(placeholder, 'g'), variables[key] || '');
  });
  
  return message;
};

// Send SMS
exports.sendSMS = async ({ to, template, variables = {} }) => {
  try {
    const smsTemplate = await SMSTemplate.findOne({ code: template, isActive: true });
    
    if (!smsTemplate) {
      throw new Error(`Template ${template} not found`);
    }

    const message = compileMessage(smsTemplate, variables);
    const provider = process.env.SMS_PROVIDER || 'console';
    
    if (!providers[provider]) {
      throw new Error(`SMS provider ${provider} not supported`);
    }

    const result = await providers[provider].send({
      to,
      message,
      template,
      variables
    });

    // Log SMS sent (you might want to save this to a database)
    console.log(`SMS sent to ${to} using template ${template}`);

    return result;
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};

// Get available templates
exports.getTemplates = async () => {
  return await SMSTemplate.find({ isActive: true });
};

// Initialize default templates
exports.initializeDefaultTemplates = async () => {
  const defaultTemplates = [
    {
      name: 'خوش‌آمدگویی',
      code: 'WELCOME',
      content: 'به {brandName} خوش آمدید 🌟\nارزیابی شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس خواهند گرفت.',
      variables: ['firstName', 'lastName', 'brandName'],
      category: 'welcome'
    },
    {
      name: 'یادآوری ارزیابی',
      code: 'REMINDER',
      content: 'سلام {firstName} عزیز 👋\nیادآوری می‌کنیم که ارزیابی شما در حال بررسی است.\nبرای اطلاعات بیشتر با ما تماس بگیرید.',
      variables: ['firstName', 'lastName'],
      category: 'reminder'
    },
    {
      name: 'نتیجه ارزیابی',
      code: 'RESULT',
      content: 'سلام {firstName} عزیz 🎉\nنتایج ارزیابی شما آماده است.\nامتیاز: {score}\nبرای مشاهده جزئیات به پنل کاربری مراجعه کنید.',
      variables: ['firstName', 'score'],
      category: 'notification'
    },
    {
      name: 'ارزیابی جدید',
      code: 'NEW_EVALUATION',
      content: 'ارزیابی جدید ثبت شد 📋\nنام: {firstName} {lastName}\nبرند: {brand}\nشماره: {phone}',
      variables: ['firstName', 'lastName', 'brand', 'phone'],
      category: 'alert'
    }
  ];

  for (const templateData of defaultTemplates) {
    const existingTemplate = await SMSTemplate.findOne({ code: templateData.code });
    if (!existingTemplate) {
      await SMSTemplate.create(templateData);
    }
  }
};