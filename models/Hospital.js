
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Can be null for hospitals created by admin
  },
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Hospital location is required']
  },
  address: {
    type: String,
    required: [true, 'Hospital address is required']
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Hospital phone is required']
    },
    email: {
      type: String,
      required: [true, 'Hospital email is required']
    }
  },
  services: [{
    type: String,
    enum: [
      'Emergency Care',
      'Cardiology',
      'Pediatrics',
      'Gynecology',
      'Orthopedics',
      'Dermatology',
      'Neurology',
      'Psychiatry',
      'Surgery',
      'Oncology',
      'Ophthalmology',
      'ENT',
      'Urology',
      'Endocrinology',
      'Mental Health',
      'Dentistry',
      'General Medicine',
      'Radiology',
      'Laboratory',
      'Pharmacy'
    ]
  }],
  workingHours: {
    monday: { start: String, end: String },
    tuesday: { start: String, end: String },
    wednesday: { start: String, end: String },
    thursday: { start: String, end: String },
    friday: { start: String, end: String },
    saturday: { start: String, end: String },
    sunday: { start: String, end: String }
  },
  externalApiUrl: { type: String },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  departments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
