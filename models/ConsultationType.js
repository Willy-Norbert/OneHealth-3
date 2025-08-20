
const mongoose = require('mongoose');

const consultationTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Consultation type name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['General', 'Specialist'],
    required: true
  },
  speciality: {
    type: String,
    required: function() {
      return this.category === 'Specialist';
    }
  },
  fee: {
    type: Number,
    required: [true, 'Consultation fee is required']
  },
  duration: {
    type: Number,
    default: 30 // minutes
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

module.exports = mongoose.model('ConsultationType', consultationTypeSchema);
