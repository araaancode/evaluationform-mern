// models/Evaluation.js
const evaluationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  brand: { type: String, required: true }, // برای تفکیک برندها
  
  // بخش ۱: اطلاعات فردی
  personalInfo: {
    firstName: String,
    lastName: String,
    gender: String,
    birthDate: Date,
    militaryStatus: String, // فقط برای مردان
    exemptionType: String // در صورت معافیت
  },
  
  // بخش ۲: اطلاعات تحصیلی
  education: {
    degree: String,
    field: String,
    gpa: Number,
    university: String,
    graduationYear: Number
  },
  
  // بخش ۳: اطلاعات شغلی
  employment: {
    jobTitle: String,
    experience: Number,
    field: String,
    company: String,
    contractType: String,
    salaryRange: String
  },
  
  // بخش ۴: اطلاعات مهاجرتی
  immigration: {
    targetCountries: [String],
    purpose: String,
    travelHistory: String,
    schengenVisa: String,
    visaRejections: String,
    previousAttempts: Boolean,
    previousAttemptsDesc: String
  },
  
  // بخش ۵: سطح زبان
  language: {
    targetLanguage: String,
    level: String,
    certificate: String,
    score: String
  },
  
  // بخش ۶: اطلاعات خانوادگی
  family: {
    maritalStatus: String,
    childrenCount: Number,
    childrenAges: String,
    familyMigrationPlan: String
  },
  
  status: { type: String, enum: ['pending', 'completed', 'under_review'], default: 'pending' },
  score: Number // امتیاز نهایی
}, { timestamps: true });