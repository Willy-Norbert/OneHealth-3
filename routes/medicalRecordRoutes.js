const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  getPatientMedicalHistory,
  searchMedicalRecords,
} = require('../controllers/medicalRecordController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Medical Records
 *   description: Patient medical records
 */

router.use(protect);

/**
 * @swagger
 * /api/medical-records:
 *   get:
 *     summary: Get medical records (Doctor/Admin)
 *     tags: [Medical Records]
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     summary: Create medical record (Doctor)
 *     tags: [Medical Records]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/', restrictTo('doctor', 'admin'), getAllMedicalRecords);
router.post('/', restrictTo('doctor'), createMedicalRecord);

/**
 * @swagger
 * /api/medical-records/search:
 *   get:
 *     summary: Search records (Doctor/Admin)
 *     tags: [Medical Records]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/search', restrictTo('doctor', 'admin'), searchMedicalRecords);

/**
 * @swagger
 * /api/medical-records/{id}:
 *   get:
 *     summary: Get record
 *     tags: [Medical Records]
 *     security: [{ bearerAuth: [] }]
 *   put:
 *     summary: Update record (Doctor)
 *     tags: [Medical Records]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', getMedicalRecord);
router.put('/:id', restrictTo('doctor'), updateMedicalRecord);

/**
 * @swagger
 * /api/medical-records/patients/{patientId}:
 *   get:
 *     summary: Get patient's medical history
 *     tags: [Medical Records]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/patients/:patientId', getPatientMedicalHistory);

module.exports = router;
