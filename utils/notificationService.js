const Notification = require('../models/Notification');

const createNotification = async ({ recipient, sender, type, message, relatedEntity }) => {
  try {
    const notification = new Notification({
      recipient,
      sender,
      type,
      message,
      relatedEntity,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

module.exports = { createNotification };







