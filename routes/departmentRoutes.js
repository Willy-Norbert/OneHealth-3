const express = require('express');
const {
  getAllDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentsByHospital
} = require('../controllers/departmentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - name
 *         - hospital
 *       properties:
 *         name:
 *           type: string
 *           enum: [General Medicine, Cardiology, Pediatrics, Gynecology, Orthopedics, Dermatology, Neurology, Psychiatry, Emergency, Surgery, Oncology, Ophthalmology, ENT, Urology, Endocrinology, Mental Health, Dentistry]
 *         description:
 *           type: string
 *         hospital:
 *           type: string
 *         services:
 *           type: array
 *           items:
 *             type: string
 *         consultationFee:
 *           type: number
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: hospital
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *   post:
 *     summary: Create new department
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       201:
 *         description: Department created successfully
 *       403:
 *         description: Admin access required
 */

// Public routes
router.get('/', getAllDepartments);
router.get('/:id', getDepartment);

// Admin routes
router.use(protect);
router.post('/', restrictTo('admin', 'hospital'), createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

module.exports = router;