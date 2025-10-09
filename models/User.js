const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Legacy display name (kept for backwards compatibility)
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  // New patient-first fields
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },

  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
      'Please provide a valid email'
    ]
  },
  phone: { type: String, unique: true, sparse: true },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin', 'hospital'],
    default: 'patient'
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: function() {
      return this.role === 'hospital';
    }
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otpCode: String,
  otpExpires: Date,
  passwordResetOTP: String,
  passwordResetExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Rwanda-specific identity
  nationalId: { type: String },

  // Address & social
  address: { type: String },
  district: { type: String },
  province: { type: String },
  ubudehe: { type: Number, min: 1, max: 4 },

  // Emergency contact
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },

  // Insurance
  insurance: {
    type: { type: String },
    insurerName: String,
    policyNumber: String,
    policyHolderName: String,
    expiryDate: Date,
    frontUrl: String,
    backUrl: String
  },

  // Clinical baseline
  dob: Date,
  gender: String,
  bloodGroup: String,
  allergies: [String],
  medications: [String],
  pastMedicalHistory: String,
  chronicConditions: [String],
  currentSymptoms: String,

  // Files
  profileImageUrl: {
    type: String,
    default: 'https://res.cloudinary.com/your_cloud_name/image/upload/v1678901234/default_profile_image.png'
  },
  idDocumentUrl: String,
  additionalDocuments: [{ fileName: String, url: String }],
  consentTelehealth: { type: Boolean, default: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Correct model name without space
module.exports = mongoose.model('User', userSchema);
