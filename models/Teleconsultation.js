
const mongoose = require('mongoose');

const teleconsultationSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  consultationType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ConsultationType',
    required: true
  },
  insurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Insurance'
  },
  patientDetails: {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, enum: ['Male', 'Female'], required: true },
    weight: { type: Number },
    nationalId: { type: String },
    insuranceNumber: { type: String },
    phoneNumber: { type: String, required: true }
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['Bank Transfer', 'USSD', 'Out-of-Pocket'],
      required: true
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending'
    },
    transactionId: String
  },
  consultation: {
    type: {
      type: String,
      enum: ['Video Call', 'Phone Call'],
      default: 'Video Call'
    },
    scheduledDate: Date,
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled'
    },
    meetingLink: String,
    doctorNotes: String,
    diagnosis: String,
    prescription: String,
    referral: String
  },
  followUp: {
    required: { type: Boolean, default: false },
    scheduledDate: Date,
    notes: String
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

teleconsultationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Teleconsultation', teleconsultationSchema);
