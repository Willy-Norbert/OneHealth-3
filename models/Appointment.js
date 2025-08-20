const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Assuming doctors are also in User model with role 'doctor'
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  department: {
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
      'Emergency',
      'Surgery',
      'Oncology',
      'Ophthalmology',
      'ENT',
      'Urology',
      'Endocrinology'
    ]
  },
  appointmentType: {
    type: String,
    enum: ['virtual', 'in-person'],
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  reasonForVisit: {
    type: String,
    required: true
  },
  previousVisit: {
    type: Boolean,
    default: false
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String
  },
  patientDetails: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    address: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  notes: String,
  consultationFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  meetingLink: String, // For virtual appointments
  reminderSent: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ hospital: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);