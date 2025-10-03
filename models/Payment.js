const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['MTN', 'IREMBO', 'DEV_FAKE'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'RWF' },
  status: { 
    type: String, 
    enum: ['REQUIRES_ACTION', 'PROCESSING', 'SUCCEEDED', 'FAILED'], 
    default: 'REQUIRES_ACTION' 
  },
  split: {
    platformFee: { type: Number, required: true },
    hospitalAmount: { type: Number, required: true },
  },
  providerSessionId: { type: String },
  checkoutUrl: { type: String },
  providerMetadata: { type: Object },
}, { timestamps: true });

paymentSchema.index({ appointment: 1 });
paymentSchema.index({ hospital: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
