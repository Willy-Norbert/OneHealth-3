const express = require('express');
const {
  getAllDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDoctorsByDepartment,
  getDoctorByUserId
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
router.get('/department/:departmentId', getDoctorsByDepartment);
router.get('/profile/:userId', getDoctorByUserId);
router.get('/', getAllDoctors);
router.get('/:id', getDoctor);


// Protected routes
router.use(protect, getHospitalId, ensureHospitalLink);
router.post('/', restrictTo('admin', 'hospital'), createDoctor);
router.put('/:id', updateDoctor); // Admin, hospital owner, or doctor themselves
router.delete('/:id', restrictTo('admin', 'hospital'), deleteDoctor);

module.exports = router;