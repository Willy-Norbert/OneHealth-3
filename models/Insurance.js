
const mongoose = require('mongoose');

const insuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Insurance name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Public', 'Private'],
    required: true
  },
  coveragePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Insurance', insuranceSchema);
