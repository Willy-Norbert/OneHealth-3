const express = require('express');
const {
  createPrescription,
  getPatientPrescriptions,
  getDoctorAuthoredPrescriptions,
  getMyPrescriptions,
  getPrescriptionPdf,
} = require('../controllers/prescriptionController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription management APIs
 */

/**
 * @swagger
 * /api/prescriptions:
 *   post:
 *     summary: Create a new prescription (Doctor only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patient, appointment, diagnosis, medications]
 *             properties:
 *               patient:
 *                 type: string
 *                 description: ID of the patient
 *               appointment:
 *                 type: string
 *                 description: ID of the associated appointment
 *               diagnosis:
 *                 type: string
 *                 description: Diagnosis for the prescription
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     frequency:
 *                       type: string
 *                     instructions:
 *                       type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Access denied
 */
router.post('/', restrictTo('doctor'), createPrescription);

/**
 * @swagger
 * /api/prescriptions/patient/{patientId}:
 *   get:
 *     summary: Get all prescriptions for a specific patient
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the patient
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
 *     responses:
 *       200:
 *         description: Patient prescriptions retrieved successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Patient not found
 */
router.get('/patient/:patientId', getPatientPrescriptions);

/**
 * @swagger
 * /api/prescriptions/doctor-authored:
 *   get:
 *     summary: Get all prescriptions authored by the logged-in doctor
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *     responses:
 *       200:
 *         description: Doctor's authored prescriptions retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/doctor-authored', restrictTo('doctor'), getDoctorAuthoredPrescriptions);

/**
 * @swagger
 * /api/prescriptions/my:
 *   get:
 *     summary: Get current user's prescriptions
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User prescriptions retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/my', getMyPrescriptions);
router.get('/:id/pdf', getPrescriptionPdf);

module.exports = router;
