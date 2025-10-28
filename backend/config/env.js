// server/config/env.js
const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../../.env')
});

module.exports = {
  // تنظیمات سرور
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  clientUrl: process.env.CLIENT_URL,

  // دیتابیس
  mongoose: {
    url: process.env.MONGODB_URI + (process.env.NODE_ENV === 'test' ? '_test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  // احراز هویت
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    cookieExpire: process.env.JWT_COOKIE_EXPIRE,
  },

  // پیامک
  sms: {
    provider: process.env.SMS_PROVIDER,
    kavenegar: {
      apiKey: process.env.KAVENEGAR_API_KEY,
      sender: process.env.KAVENEGAR_SENDER,
    },
    mediar: {
      apiKey: process.env.MEDIAR_SMS_API_KEY,
      sender: process.env.MEDIAR_SMS_SENDER,
    },
    templates: {
      evaluationSubmitted: process.env.SMS_EVALUATION_SUBMITTED,
      adminNotification: process.env.SMS_ADMIN_NOTIFICATION,
    }
  },

  // ایمیل
  email: {
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },

  // امنیت
  security: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS),
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
    }
  },

  // برندها
  brands: {
    brand1: {
      name: process.env.BRAND_1_NAME,
      domain: process.env.BRAND_1_DOMAIN,
      colors: {
        primary: process.env.BRAND_1_COLOR_PRIMARY,
        secondary: process.env.BRAND_1_COLOR_SECONDARY,
      }
    },
    brand2: {
      name: process.env.BRAND_2_NAME,
      domain: process.env.BRAND_2_DOMAIN,
      colors: {
        primary: process.env.BRAND_2_COLOR_PRIMARY,
        secondary: process.env.BRAND_2_COLOR_SECONDARY,
      }
    },
    brand3: {
      name: process.env.BRAND_3_NAME,
      domain: process.env.BRAND_3_DOMAIN,
      colors: {
        primary: process.env.BRAND_3_COLOR_PRIMARY,
        secondary: process.env.BRAND_3_COLOR_SECONDARY,
      }
    }
  }
};