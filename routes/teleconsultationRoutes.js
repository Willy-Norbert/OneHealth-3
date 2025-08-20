
const express = require('express');
const {
  getConsultationTypes,
  getInsuranceOptions,
  createTeleconsultation,
  getUserTeleconsultations,
  updateTeleconsultationStatus
} = require('../controllers/consultationController');
const {
  getAllHospitals,
  createHospital,
  updateHospital,
  deleteHospital
} = require('../controllers/hospitalController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/hospitals', getAllHospitals);
router.get('/consultation-types', getConsultationTypes);
router.get('/insurance-options', getInsuranceOptions);

// Protected routes
router.use(protect);
router.post('/', createTeleconsultation);
router.get('/my-consultations', getUserTeleconsultations);
router.patch('/:id', updateTeleconsultationStatus);

// Admin routes
router.use(restrictTo('admin'));
router.post('/hospitals', createHospital);
router.patch('/hospitals/:id', updateHospital);
router.delete('/hospitals/:id', deleteHospital);

module.exports = router;
