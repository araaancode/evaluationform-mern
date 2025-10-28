require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Brand = require('../models/Brand');
const SMSTemplate = require('../models/SMSTemplate');
const { initializeDefaultTemplates } = require('../utils/smsUtils');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/faramohajerat');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Brand.deleteMany({});
    await SMSTemplate.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      firstName: 'مدیر',
      lastName: 'سیستم',
      phone: '09120000000',
      password: 'admin123',
      role: 'admin',
      email: 'admin@faramohajerat.ir'
    });
    console.log('✅ Created admin user');

    // Create test user
    const testUser = await User.create({
      firstName: 'تست',
      lastName: 'کاربر',
      phone: '09121234567',
      password: '123456',
      email: 'test@example.com'
    });
    console.log('✅ Created test user');

    // Create brands
    const brands = await Brand.create([
      {
        name: 'آزمون لند',
        code: 'AZMOONLAND',
        description: 'سامانه تخصصی آزمون و ارزیابی آنلاین',
        contact: {
          phone: '021-12345671',
          email: 'info@azmoonland.ir',
          address: 'تهران، خیابان انقلاب، پلاک ۱۲۳',
          website: 'https://azmoonland.ir'
        },
        colors: {
          primary: '#8B0000',
          secondary: '#B22222'
        },
        socialMedia: {
          instagram: 'https://instagram.com/azmoonland',
          telegram: 'https://t.me/azmoonland'
        }
      },
      {
        name: 'فرامهاجرت',
        code: 'FARAMOHAJERAT',
        description: 'مشاوره تخصصی مهاجرت تحصیلی و کاری',
        contact: {
          phone: '021-12345672',
          email: 'info@faramohajerat.ir',
          address: 'تهران، خیابان ولیعصر، پلاک ۱۲۴',
          website: 'https://faramohajerat.ir'
        },
        colors: {
          primary: '#2E8B57',
          secondary: '#3CB371'
        },
        socialMedia: {
          instagram: 'https://instagram.com/faramohajerat',
          telegram: 'https://t.me/faramohajerat'
        }
      },
      {
        name: 'خودجوش',
        code: 'KHODJOSH',
        description: 'پلتفرم توسعه فردی و مهارت‌آموزی',
        contact: {
          phone: '021-12345673',
          email: 'info@khodjosh.ir',
          address: 'تهران، میدان ونک، برج سپهر',
          website: 'https://khodjosh.ir'
        },
        colors: {
          primary: '#1E90FF',
          secondary: '#87CEFA'
        },
        socialMedia: {
          instagram: 'https://instagram.com/khodjosh',
          telegram: 'https://t.me/khodjosh'
        }
      }
    ]);
    console.log('✅ Created brands');

    // Initialize SMS templates
    await initializeDefaultTemplates();
    console.log('✅ Created SMS templates');

    console.log('🎉 Database seeded successfully!');
    console.log('📱 Admin login: 09120000000 / admin123');
    console.log('👤 Test user login: 09121234567 / 123456');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();