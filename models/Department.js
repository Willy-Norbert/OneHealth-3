const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    enum: [
      'General Medicine',
      'Cardiology', 
      'Pediatrics',
      'Gynecology',
      'Orthopedics',
      'Dermatology',
      'Neurology',
      'Psychiatry',
      'Emergency',
      'Surgery',
      'Oncology',
      'Ophthalmology',
      'ENT',
      'Urology',
      'Endocrinology',
      'Mental Health',
      'Dentistry'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  services: [{
    type: String
  }],
  consultationFee: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
departmentSchema.index({ hospital: 1, name: 1 });
departmentSchema.index({ isActive: 1 });

module.exports = mongoose.model('Department', departmentSchema);