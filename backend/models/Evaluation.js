const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  brand: {
    type: String,
    required: true,
    enum: ['azmoonland', 'faramohajerat', 'khodjosh'],
    index: true
  },
  
  // Section 1: Personal Information
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { 
      type: String, 
      enum: ['زن', 'مرد', 'ترجیح می‌دهم نگویم'],
      required: true 
    },
    birthDate: { type: Date, required: true },
    phone: { type: String, required: true },
    militaryStatus: { type: String },
    exemptionType: { type: String }
  },
  
  // Section 2: Education
  education: {
    degree: {
      type: String,
      enum: ['دیپلم', 'فوق‌دیپلم', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'],
      required: true
    },
    field: { type: String, required: true },
    gpa: { type: Number, min: 0, max: 20, required: true },
    university: { type: String, required: true },
    graduationYear: { type: Number, required: true }
  },
  
  // Section 3: Employment
  employment: {
    jobTitle: { type: String, required: true },
    experience: { type: Number, required: true },
    field: {
      type: String,
      enum: ['IT', 'پزشکی', 'آموزش', 'مهندسی', 'هنر', 'سایر'],
      required: true
    },
    company: { type: String },
    contractType: {
      type: String,
      enum: ['رسمی', 'پیمانی', 'آزاد'],
      required: true
    },
    salaryRange: { type: String }
  },
  
  // Section 4: Immigration
  immigration: {
    targetCountries: [{ type: String }],
    purpose: {
      type: String,
      enum: ['تحصیلی', 'کاری', 'سرمایه‌گذاری', 'پناهندگی', 'همراهی خانواده'],
      required: true
    },
    travelHistory: { type: String, required: true },
    schengenVisa: { type: String },
    visaRejections: { type: String },
    previousAttempts: { type: Boolean, default: false },
    previousAttemptsDesc: { type: String }
  },
  
  // Section 5: Language
  language: {
    targetLanguage: {
      type: String,
      enum: ['انگلیسی', 'آلمانی', 'فرانسوی', 'ایتالیایی', 'اسپانیایی', 'سایر'],
      required: true
    },
    level: {
      type: String,
      enum: ['مبتدی', 'متوسط', 'پیشرفته'],
      required: true
    },
    certificate: {
      type: String,
      enum: ['IELTS', 'TOEFL', 'PTE', 'TestDaF', 'TCF', 'DELF', 'سایر', 'ندارم'],
      required: true
    },
    score: { type: String }
  },
  
  // Section 6: Family
  family: {
    maritalStatus: {
      type: String,
      enum: ['مجرد', 'متأهل', 'طلاق‌گرفته', 'هم‌خانگی'],
      required: true
    },
    childrenCount: { type: Number, default: 0 },
    childrenAges: { type: String },
    familyMigrationPlan: {
      type: String,
      enum: ['بله', 'خیر', 'هنوز مشخص نیست']
    }
  },
  
  // Evaluation Results
  status: {
    type: String,
    enum: ['pending', 'under_review', 'completed', 'rejected'],
    default: 'pending',
    index: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  assessment: {
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendations: [{ type: String }],
    suggestedCountries: [{ type: String }],
    estimatedTimeline: { type: String },
    successProbability: { type: Number }
  },
  
  // Admin Notes
  adminNotes: [{
    note: String,
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // SMS History
  smsSent: [{
    template: String,
    sentAt: { type: Date, default: Date.now },
    status: String
  }]
}, {
  timestamps: true
});

// Indexes
evaluationSchema.index({ userId: 1, createdAt: -1 });
evaluationSchema.index({ brand: 1, status: 1 });
evaluationSchema.index({ 'personalInfo.phone': 1 });
evaluationSchema.index({ createdAt: -1 });

// Virtual for full name
evaluationSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Method to calculate score (simplified version)
evaluationSchema.methods.calculateScore = function() {
  let score = 50; // Base score
  
  // Education points
  const educationPoints = {
    'دیپلم': 10,
    'فوق‌دیپلم': 15,
    'کارشناسی': 20,
    'کارشناسی ارشد': 25,
    'دکتری': 30
  };
  
  score += educationPoints[this.education.degree] || 0;
  
  // Work experience points
  if (this.employment.experience >= 5) score += 20;
  else if (this.employment.experience >= 3) score += 15;
  else if (this.employment.experience >= 1) score += 10;
  
  // Language points
  if (this.language.level === 'پیشرفته') score += 15;
  else if (this.language.level === 'متوسط') score += 10;
  else if (this.language.level === 'مبتدی') score += 5;
  
  return Math.min(score, 100);
};

module.exports = mongoose.model('Evaluation', evaluationSchema);