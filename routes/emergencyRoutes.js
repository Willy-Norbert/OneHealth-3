const express = require('express');
const {
  createEmergency,
  getAllEmergencies,
  getEmergency,
  updateEmergencyStatus,
  assignResponder,
  getPatientEmergencies,
  getEmergenciesNear
} = require('../controllers/emergencyController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Emergency:
 *       type: object
 *       required:
 *         - emergencyType
 *         - severity
 *         - quickCareType
 *         - location
 *         - description
 *         - contactInfo
 *       properties:
 *         emergencyType:
 *           type: string
 *           enum: [medical, accident, maternal, respiratory, mental-health, covid, cardiac, trauma, poisoning, allergic-reaction]
 *         severity:
 *           type: string
 *           enum: [mild, moderate, severe, critical]
 *         quickCareType:
 *           type: string
 *           enum: [ambulance, doctor-on-call, nurse-on-call, medication-delivery, telemedicine]
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *         description:
 *           type: string
 *         symptoms:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/emergencies:
 *   post:
 *     summary: Create emergency request
 *     tags: [Emergencies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Emergency'
 *     responses:
 *       201:
 *         description: Emergency request created successfully
 *   get:
 *     summary: Get all emergencies (Admin/Responders)
 *     tags: [Emergencies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Emergencies retrieved successfully
 *       403:
 *         description: Admin/Responder access required
 */

// Protected routes
router.use(protect);
router.post('/', createEmergency);
router.get('/', restrictTo('admin'), getAllEmergencies);
router.get('/near', restrictTo('admin'), getEmergenciesNear);
router.get('/:id', getEmergency);
router.put('/:id/status', restrictTo('admin'), updateEmergencyStatus);
router.put('/:id/assign', restrictTo('admin'), assignResponder);

module.exports = router;