const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Medical license number is required'],
    unique: true
  },
  specialization: {
    type: String,
    required: true,
    enum: [
      'General Medicine',
      'Cardiology', 
      'Pediatrics',
      'Gynecology',
      'Orthopedics',
      'Dermatology',
      'Neurology',
      'Psychiatry',
      'Emergency Medicine',
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
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  experience: {
    type: Number,
    min: 0,
    default: 0
  },
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  certifications: [String],
  languages: [String],
  consultationModes: [{
    type: String,
    enum: ['in-person', 'video-call', 'phone-call'],
    default: 'in-person'
  }],
  availability: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    timeSlots: [{
      start: String, // e.g., "09:00"
      end: String   // e.g., "17:00"
    }]
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  // Settings for doctor (availability, preferences, etc)
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  bio: String
}, { 
  timestamps: true 
});

// Index for efficient queries
doctorSchema.index({ hospital: 1, department: 1 });
doctorSchema.index({ specialization: 1 });
doctorSchema.index({ isActive: 1 });
doctorSchema.index({ user: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);