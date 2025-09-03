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

/**
 * @swagger
 * /api/appointments/my-appointments:
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
 * /api/appointments:
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
 * /api/appointments/user/{userId}:
 *   get:
 *     summary: Get appointments for specific user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed, no-show]
 *         description: Filter by appointment status
 *     responses:
 *       200:
 *         description: User appointments retrieved successfully
 *       403:
 *         description: Not authorized to view these appointments
 */
router.get('/user/:userId', getAppointmentsByUserId);

/**
 * @swagger
 * /api/appointments/{id}/cancel:
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
router.use(restrictTo('admin','hospital'));

/**
 * @swagger
 * /api/appointments/all:
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
 * /api/appointments/stats:
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

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Get single appointment by ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointment:
 *                       $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Not authorized to view this appointment
 */
router.get('/:id', getAppointment);

/**
 * @swagger
 * /api/appointments/{id}:
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

module.exports = router;