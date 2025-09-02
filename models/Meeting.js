const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  roleContext: {
    type: String,
    enum: ['patient-doctor', 'doctor-hospital', 'hospital-admin', 'doctor-doctor', 'custom'],
    default: 'custom'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  jitsiLink: {
    type: String,
    required: true
  },
  roomName: {
    type: String,
    required: true,
    unique: true
  },
  scheduledAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  duration: {
    type: Number // in minutes
  },
  meetingType: {
    type: String,
    enum: ['video', 'audio', 'chat'],
    default: 'video'
  },
  notes: {
    type: String
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

meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
meetingSchema.index({ createdBy: 1, createdAt: -1 });
meetingSchema.index({ participants: 1, createdAt: -1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ roomName: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);