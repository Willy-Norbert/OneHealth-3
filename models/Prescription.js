const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    unique: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true,
  },
  medications: [
    {
      name: { type: String, required: true, trim: true },
      dosage: { type: String, required: true, trim: true },
      frequency: { type: String, required: true, trim: true },
      instructions: { type: String, trim: true },
    },
  ],
  notes: {
    type: String,
    trim: true,
  },
  datePrescribed: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

prescriptionSchema.pre('save', function (next) {
  if (!this.prescriptionNumber) {
    this.prescriptionNumber = `RX-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
prescriptionSchema.index({ patient: 1, datePrescribed: -1 });
prescriptionSchema.index({ doctor: 1, datePrescribed: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);