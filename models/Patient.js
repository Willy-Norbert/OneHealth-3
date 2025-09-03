const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: String,
    unique: true,
    required: true
  },
  // Demographics
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: false
  },
  
  // Contact Information
  phone: {
    type: String,
    required: true
  },
  alternatePhone: String,
  address: {
    street: String,
    city: String,
    district: String,
    province: String,
    country: { type: String, default: 'Rwanda' },
    postalCode: String
  },
  
  // Emergency Contact
  emergencyContact: {
    name: { type: String, required: true },
    relationship: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: String
  },
  
  // Medical Information
  allergies: [String],
  chronicConditions: [String],
  currentMedications: [{
    name: String,
    dosage: String,
    frequency: String,
    prescribedBy: String,
    startDate: Date
  }],
  
  // Insurance Information
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    subscriberId: String,
    coveragePercentage: Number,
    expiryDate: Date
  },
  
  // Hospital Relationships
  primaryHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  visitedHospitals: [{
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    firstVisit: Date,
    lastVisit: Date,
    totalVisits: { type: Number, default: 0 }
  }],
  
  // Medical Records References
  medicalRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Generate unique patient ID
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({}) + 1;
    this.patientId = `PAT-${year}-${count.toString().padStart(6, '0')}`;
  }
  next();
});

// Indexes for efficient queries
patientSchema.index({ user: 1 }, { unique: true });
patientSchema.index({ patientId: 1 }, { unique: true });
patientSchema.index({ primaryHospital: 1 });
patientSchema.index({ 'visitedHospitals.hospital': 1 });
patientSchema.index({ isActive: 1 });

module.exports = mongoose.model('Patient', patientSchema);