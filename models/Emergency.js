const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  emergencyNumber: {
    type: String,
    unique: true,
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emergencyType: {
    type: String,
    enum: [
      'medical',
      'accident', 
      'maternal',
      'respiratory',
      'mental-health',
      'covid',
      'cardiac',
      'trauma',
      'poisoning',
      'allergic-reaction'
    ],
    required: true
  },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe', 'critical'],
    required: true
  },
  quickCareType: {
    type: String,
    enum: ['ambulance', 'doctor-on-call', 'nurse-on-call', 'medication-delivery', 'telemedicine'],
    required: true
  },
  location: {
    address: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    landmark: String
  },
  description: {
    type: String,
    required: true
  },
  symptoms: [String],
  attachments: [{
    type: { type: String, enum: ['image', 'voice', 'video'] },
    url: String,
    description: String
  }],
  contactInfo: {
    primaryPhone: { type: String, required: true },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  assignedTo: {
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Doctor, Nurse, or Emergency Personnel
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    ambulanceId: String,
    estimatedArrival: Date
  },
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'help-on-way', 'on-scene', 'resolved', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  responseNotes: String,
  outcome: {
    treatmentProvided: String,
    hospitalTransfer: {
      required: { type: Boolean, default: false },
      hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
      },
      reason: String
    },
    followUpRequired: { type: Boolean, default: false },
    followUpInstructions: String
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    feedback: String
  }
}, { 
  timestamps: true 
});

// Auto-generate emergency number
emergencySchema.pre('save', async function(next) {
  if (!this.emergencyNumber) {
    const count = await mongoose.model('Emergency').countDocuments();
    this.emergencyNumber = `EMG-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Update status history when status changes
emergencySchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Index for efficient queries
emergencySchema.index({ patient: 1, createdAt: -1 });
emergencySchema.index({ status: 1 });
emergencySchema.index({ emergencyType: 1 });
emergencySchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Emergency', emergencySchema);