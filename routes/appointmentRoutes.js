const express = require('express');
const {
  createAppointment,
  getUserAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableTimeSlots,
  getAppointmentStats
} = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/available-slots', getAvailableTimeSlots);

// Protected routes
router.use(protect);
router.post('/', createAppointment);
router.get('/my-appointments', getUserAppointments);
router.patch('/:id/cancel', cancelAppointment);

// Admin routes
router.use(restrictTo('admin'));
router.get('/all', getAllAppointments);
router.patch('/:id', updateAppointmentStatus);
router.get('/stats', getAppointmentStats);

module.exports = router;