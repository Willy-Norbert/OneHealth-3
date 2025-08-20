const express = require('express');
const router = express.Router(); // <-- Add this

const {
  getConsultationTypes,
  getInsuranceOptions,
  createTeleconsultation,
  getUserTeleconsultations,
  updateTeleconsultationStatus,
  getTeleconsultation,
  getDoctorTeleconsultations
} = require('../controllers/consultationController');

const {
  getAllHospitals,
  createHospital,
  updateHospital,
  deleteHospital
} = require('../controllers/hospitalController');

const { protect, restrictTo } = require('../middleware/auth');

/**
 * @swagger
 * /api/teleconsultation/{id}:
 *   get:
 *     summary: Get single teleconsultation
 *     tags: [Teleconsultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teleconsultation retrieved successfully
 *       404:
 *         description: Teleconsultation not found
 *       403:
 *         description: Not authorized to view this consultation
 *   patch:
 *     summary: Update teleconsultation status
 *     tags: [Teleconsultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               consultation:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [Scheduled, In Progress, Completed, Cancelled]
 *                   doctorNotes:
 *                     type: string
 *                   diagnosis:
 *                     type: string
 *                   prescription:
 *                     type: string
 *     responses:
 *       200:
 *         description: Teleconsultation updated successfully
 *
 * /api/teleconsultation/doctor/{doctorId}/consultations:
 *   get:
 *     summary: Get doctor's teleconsultations
 *     tags: [Teleconsultations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor's consultations retrieved successfully
 *       403:
 *         description: Not authorized to view these consultations
 */

// Public routes
router.get('/hospitals', getAllHospitals);
router.get('/consultation-types', getConsultationTypes);
router.get('/insurance-options', getInsuranceOptions);

// Protected routes
router.use(protect);
router.post('/', createTeleconsultation);
router.get('/my-consultations', getUserTeleconsultations);
router.get('/:id', getTeleconsultation);
router.patch('/:id', updateTeleconsultationStatus);

// Doctor routes
router.get('/doctor/:doctorId/consultations', getDoctorTeleconsultations);

// Admin routes
router.use(restrictTo('admin'));
router.post('/hospitals', createHospital);
router.patch('/hospitals/:id', updateHospital);
router.delete('/hospitals/:id', deleteHospital);

module.exports = router;
