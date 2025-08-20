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
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 */
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
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
 *         description: Appointment cancelled successfully
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
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
 *                 enum: [pending, confirmed, cancelled, completed, no-show]
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
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
 *         description: Appointment statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 */
router.get('/stats', getAppointmentStats);

module.exports = router;
