const express = require('express');
const {
  getAllDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByDepartment,
  getDoctorByUserId,
  getDoctorsByHospitalAndDepartment,
  updateDoctorByHospital,
  getMySettings,
  updateMySettings
} = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/auth');
const { getHospitalId, ensureHospitalLink } = require('../middleware/hospitalMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - user
 *         - licenseNumber
 *         - specialization
 *         - hospital
 *         - department
 *         - consultationFee
 *       properties:
 *         user:
 *           type: string
 *         licenseNumber:
 *           type: string
 *         specialization:
 *           type: string
 *         hospital:
 *           type: string
 *         department:
 *           type: string
 *         experience:
 *           type: number
 *         consultationFee:
 *           type: number
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *         consultationModes:
 *           type: array
 *           items:
 *             type: string
 *             enum: [in-person, video-call, phone-call]
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors with filtering
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: hospital
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctors retrieved successfully
 */

// Public routes
router.get('/hospital/:hospitalId/department/:departmentId', getDoctorsByHospitalAndDepartment);
router.get('/department/:departmentId', getDoctorsByDepartment);
router.get('/user/:userId', getDoctorByUserId); // Changed from /profile/:userId to /user/:userId
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);


// Doctor self-settings and self-availability (should not be wrapped by hospital middleware)
router.get('/settings', protect, restrictTo('doctor'), getMySettings);
router.put('/settings', protect, restrictTo('doctor'), updateMySettings);
const { getMyAvailability, updateMyAvailability, getDoctorAvailabilityByHospital, updateDoctorAvailabilityByHospital, lockDoctorAvailabilityByHospital } = require('../controllers/doctorController');
router.get('/availability', protect, restrictTo('doctor'), getMyAvailability);
router.put('/availability', protect, restrictTo('doctor'), updateMyAvailability);

// Routes that require hospital context
router.use(protect, getHospitalId, ensureHospitalLink);
router.post('/', restrictTo('admin', 'hospital', 'doctor'), createDoctor);
router.put('/:id', updateDoctor); // Admin, hospital owner, or doctor themselves
router.put('/:id/hospital-update', restrictTo('hospital'), updateDoctorByHospital); // New route for hospital to update doctor
router.delete('/:id', restrictTo('admin', 'hospital'), deleteDoctor);
router.get('/:id/availability', protect, restrictTo('hospital'), getDoctorAvailabilityByHospital);
router.put('/:id/availability', protect, restrictTo('hospital'), updateDoctorAvailabilityByHospital);
router.put('/:id/availability/lock', protect, restrictTo('hospital'), lockDoctorAvailabilityByHospital);

module.exports = router;