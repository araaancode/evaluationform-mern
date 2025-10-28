const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    required: true
  },
  contact: {
    phone: String,
    email: String,
    address: String,
    website: String
  },
  colors: {
    primary: { type: String, default: '#8B0000' },
    secondary: { type: String, default: '#B22222' }
  },
  socialMedia: {
    instagram: String,
    telegram: String,
    whatsapp: String,
    linkedin: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  config: {
    evaluationFields: [String],
    requiredDocuments: [String],
    pricing: {
      basic: Number,
      premium: Number,
      enterprise: Number
    }
  }
}, {
  timestamps: true
});

// Pre-save to ensure code is uppercase
brandSchema.pre('save', function(next) {
  if (this.code) {
    this.code = this.code.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Brand', brandSchema);