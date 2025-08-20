const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  getPatientPrescriptions,
  uploadPrescription,
} = require('../controllers/prescriptionController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription APIs
 * components:
 *   schemas:
 *     Prescription:
 *       type: object
 *       properties:
 *         patient: { type: string }
 *         doctor: { type: string }
 *         medications:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /api/prescriptions:
 *   get:
 *     summary: Get prescriptions (Doctor/Admin)
 *     tags: [Prescriptions]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Create prescription (Doctor)
 *     tags: [Prescriptions]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
router.use(protect);
router.get('/', restrictTo('doctor', 'admin'), getAllPrescriptions);
router.get('/:id', getPrescription);
router.post('/', restrictTo('doctor'), createPrescription);
router.put('/:id', restrictTo('doctor', 'admin'), updatePrescription);

/**
 * @swagger
 * /api/prescriptions/patients/{patientId}:
 *   get:
 *     summary: Get patient's prescriptions
 *     tags: [Prescriptions]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 */
router.get('/patients/:patientId', getPatientPrescriptions);

/**
 * @swagger
 * /api/prescriptions/upload:
 *   post:
 *     summary: Upload prescription image (Patient)
 *     tags: [Prescriptions]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
router.post('/upload', restrictTo('patient'), uploadPrescription);

module.exports = router;
