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

/**
 * @swagger
 * tags:
 *   name: Appointments
 *   description: Appointment management APIs
 */

/**
 * @swagger
 * /appointments/available-slots:
 *   get:
 *     summary: Get available appointment time slots
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of available time slots
 */
router.get('/available-slots', getAvailableTimeSlots);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: 2025-08-25
 *               time:
 *                 type: string
 *                 example: "10:00"
 *     responses:
 *       201:
 *         description: Appointment created
 */
router.use(protect);
router.post('/', createAppointment);

/**
 * @swagger
 * /appointments/my-appointments:
 *   get:
 *     summary: Get logged-in user appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user appointments
 */
router.get('/my-appointments', getUserAppointments);

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancel an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment cancelled
 */
router.patch('/:id/cancel', cancelAppointment);

// Admin routes
router.use(restrictTo('admin'));

/**
 * @swagger
 * /appointments/all:
 *   get:
 *     summary: Get all appointments (admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all appointments
 */
router.get('/all', getAllAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   patch:
 *     summary: Update appointment status (admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Appointment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled, completed]
 *     responses:
 *       200:
 *         description: Appointment status updated
 */
router.patch('/:id', updateAppointmentStatus);

/**
 * @swagger
 * /appointments/stats:
 *   get:
 *     summary: Get appointment statistics (admin only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointment stats
 */
router.get('/stats', getAppointmentStats);

module.exports = router;
