const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: notifications,
  });
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.recipient.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to update this notification');
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification,
  });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (notification.recipient.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized to delete this notification');
  }

  await notification.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

// @desc    Mark all notifications as read for current user
// @route   PUT /api/notifications/mark-all/read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user.id, read: { $ne: true } }, { $set: { read: true } });
  const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, message: 'All notifications marked as read', data: notifications });
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};







