const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

// Get notifications for a user
router.get('/', protect, notificationController.getNotifications);

// Mark a notification as read
router.put('/:id/read', protect, notificationController.markAsRead);

// Mark all as read
router.put('/mark-all/read', protect, notificationController.markAllAsRead);

// Delete a notification
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;
