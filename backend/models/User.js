// models/User.js
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['زن', 'مرد', 'ترجیح می‌دهم نگویم'] },
  birthDate: Date,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // سایر فیلدهای اطلاعات شخصی
}, { timestamps: true });