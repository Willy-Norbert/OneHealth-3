const express = require('express');
const {
  createAppointment,
  getAppointment,
  getUserAppointments,
  getAppointmentsByUserId,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableTimeSlots,
  getAppointmentStats,
  reassignAppointment,
  getHospitalStats,
  getDoctorAppointments
} = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management APIs
 */

/**
 * @swagger
 * /api/appointments/available-slots:
 *   get:
 *     summary: Get available appointment time slots
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/available-slots', getAvailableTimeSlots);

// Protected routes
router.use(protect);

// More specific routes should come before general :id routes
router.get('/my-appointments', getUserAppointments);
router.get('/my-doctor-appointments', restrictTo('doctor'), getDoctorAppointments);
router.get('/hospital', restrictTo('hospital', 'admin'), getAllAppointments);
router.get('/user/:userId', getAppointmentsByUserId);
router.post('/', createAppointment);
router.patch('/:id/cancel', cancelAppointment);

// General route for fetching a single appointment by ID (must be after more specific routes that use dynamic IDs)
router.get('/:id', getAppointment);

// Admin and Hospital specific routes
router.use(restrictTo('admin','hospital'));

router.get('/hospital-stats', restrictTo('hospital'), getHospitalStats);
router.get('/all', getAllAppointments);
router.get('/stats', getAppointmentStats);
router.patch('/:id', updateAppointmentStatus);
router.patch('/:id/reassign', reassignAppointment);

module.exports = router;