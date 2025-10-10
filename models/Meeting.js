const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  meeting_id: {
    type: String,
    required: true,
    unique: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled', 'missed'],
    default: 'scheduled',
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  reminderSent: { type: Boolean, default: false },
  missedNotified: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

meetingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

meetingSchema.index({ doctor: 1, startTime: -1 });
meetingSchema.index({ patient: 1, startTime: -1 });

module.exports = mongoose.model('Meeting', meetingSchema);