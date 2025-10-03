const Notification = require('../models/Notification');
let io;

function setSocket(serverIo) {
  io = serverIo;
}

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
    // Emit real-time event to recipient if connected
    try {
      if (io) {
        io.to(String(recipient)).emit('notification:new', {
          _id: notification._id,
          message,
          type,
          read: false,
          createdAt: notification.createdAt,
        });
      }
    } catch (e) {
      // ignore socket errors
    }
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Failed to create notification');
  }
};

module.exports = { createNotification, setSocket };







