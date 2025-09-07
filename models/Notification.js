const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['appointment', 'user', 'emergency', 'system', 'message', 'other'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  relatedEntity: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'relatedEntity.type',
    },
    type: {
      type: String,
      enum: ['User', 'Appointment', 'Hospital', 'Emergency'], // Add other relevant types here
    },
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
