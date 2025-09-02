const mongoose = require('mongoose');

const slotLockSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  department: { type: String, required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  lockId: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
}, { timestamps: true });

// Ensure only one active lock per exact slot
slotLockSchema.index(
  { hospital: 1, department: 1, appointmentDate: 1, appointmentTime: 1 },
  { unique: true }
);

// TTL index to auto-expire locks
slotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('SlotLock', slotLockSchema);
