const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teleconsultation'
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  prescriptionNumber: {
    type: String,
    unique: true,
    required: true
  },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: String,
    quantity: { type: Number, required: true }
  }],
  diagnosis: String,
  notes: String,
  issuedDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'filled', 'cancelled'],
    default: 'active'
  },
  prescriptionImage: String, // URL to uploaded prescription image
  isDigital: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Auto-generate prescription number
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionNumber = `RX-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Index for efficient queries
prescriptionSchema.index({ patient: 1, issuedDate: -1 });
prescriptionSchema.index({ doctor: 1 });
prescriptionSchema.index({ prescriptionNumber: 1 });
prescriptionSchema.index({ status: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);