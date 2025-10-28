const mongoose = require('mongoose');

const smsTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  content: {
    type: String,
    required: true
  },
  variables: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['welcome', 'reminder', 'notification', 'promotional', 'alert'],
    default: 'notification'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  characterCount: {
    type: Number
  },
  estimatedCost: {
    type: Number,
    default: 250
  }
}, {
  timestamps: true
});

// Calculate character count before save
smsTemplateSchema.pre('save', function(next) {
  this.characterCount = this.content.length;
  next();
});

module.exports = mongoose.model('SMSTemplate', smsTemplateSchema);