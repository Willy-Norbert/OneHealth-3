const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { getHospitalId, ensureHospitalLink } = require('../middleware/hospitalMiddleware');
const {
  getAllHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  approveHospital,
  getHospitalDoctors,
  createHospitalDoctor,
  getHospitalAppointments
} = require('../controllers/hospitalController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: Hospital management operations
 * 
 * components:
 *   schemas:
 *     Hospital:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f8b2c8e1234567890abcde"
 *         userId:
 *           type: string
 *           example: "64f8b2c8e1234567890abcdf"
 *         name:
 *           type: string
 *           example: "City General Hospital"
 *         location:
 *           type: string
 *           example: "Kigali, Rwanda"
 *         address:
 *           type: string
 *           example: "123 Health Street, Kigali"
 *         contact:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *               example: "+250788123456"
 *             email:
 *               type: string
 *               example: "info@cityhospital.rw"
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Emergency Care", "Cardiology", "Pediatrics"]
 *         workingHours:
 *           type: object
 *           example: { "monday": { "start": "08:00", "end": "18:00" } }
 *         isApproved:
 *           type: boolean
 *           example: true
 *         isActive:
 *           type: boolean
 *           example: true
 *         departments:
 *           type: array
 *           items:
 *             type: string
 *           example: ["64f8b2c8e1234567890abce0"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-06T10:00:00Z"
 *     CreateHospitalRequest:
 *       type: object
 *       required: [name, location, address, contact]
 *       properties:
 *         name:
 *           type: string
 *           example: "New Medical Center"
 *         location:
 *           type: string
 *           example: "Kigali, Rwanda"
 *         address:
 *           type: string
 *           example: "456 Medical Ave, Kigali"
 *         contact:
 *           type: object
 *           required: [phone, email]
 *           properties:
 *             phone:
 *               type: string
 *               example: "+250788654321"
 *             email:
 *               type: string
 *               example: "contact@newmedical.rw"
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           example: ["General Medicine", "Surgery"]
 *         workingHours:
 *           type: object
 *           example: { "monday": { "start": "07:00", "end": "19:00" } }
 *     ApprovalRequest:
 *       type: object
 *       required: [isApproved]
 *       properties:
 *         isApproved:
 *           type: boolean
 *           example: true
 */

/**
 * @swagger
 * /api/hospitals:
 *   get:
 *     summary: Get all hospitals
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of hospitals per page
 *       - in: query
 *         name: approved
 *         schema:
 *           type: boolean
 *         description: Filter by approval status (Admin only)
 *     responses:
 *       200:
 *         description: Hospitals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hospitals retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     hospitals:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Hospital'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalHospitals:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Create a new hospital (Admin or Hospital role)
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHospitalRequest'
 *     responses:
 *       201:
 *         description: Hospital created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Admin or Hospital access required
 */

/**
 * @swagger
 * /api/hospitals/{id}:
 *   get:
 *     summary: Get hospital details
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     responses:
 *       200:
 *         description: Hospital retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Hospital retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     hospital:
 *                       $ref: '#/components/schemas/Hospital'
 *       404:
 *         description: Hospital not found
 *       403:
 *         description: Not authorized to view this hospital
 *   put:
 *     summary: Update hospital (Admin or Hospital owner)
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateHospitalRequest'
 *     responses:
 *       200:
 *         description: Hospital updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized to update this hospital
 *       404:
 *         description: Hospital not found
 *   delete:
 *     summary: Deactivate hospital (Admin only)
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     responses:
 *       200:
 *         description: Hospital deleted successfully
 *       404:
 *         description: Hospital not found
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/hospitals/{id}/approve:
 *   patch:
 *     summary: Approve or reject hospital (Admin only)
 *     tags: [Hospitals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovalRequest'
 *     responses:
 *       200:
 *         description: Hospital approval status updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Hospital not found
 *       403:
 *         description: Admin access required
 */

router.get('/', getAllHospitals);       // List all hospitals
router.get('/:id', getHospital);        // Get hospital by ID

// ==================
// My hospital (logged-in user)
// ==================
router.get('/me', protect, async (req, res) => {
  try {
    const hospital = await require('../models/Hospital').findOne({ userId: req.user._id }).populate('departments');
    if (!hospital) return res.status(404).json({ message: 'Hospital not found for this user' });
    res.status(200).json({ success: true, data: { hospital } });
  } catch (error) {
    console.error('Get my hospital error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching hospital' });
  }
});

// ==================
// Protected routes
// ==================

// Create hospital (Admin or Hospital role)
router.post('/', protect, getHospitalId, ensureHospitalLink, restrictTo('admin','hospital'), createHospital);

// Update hospital (Admin or Hospital owner)
router.put('/:id', protect, getHospitalId, ensureHospitalLink, restrictTo('admin','hospital'), updateHospital);

// Delete hospital (Admin only)
router.delete('/:id', protect, restrictTo('admin'), deleteHospital);

// Approve hospital (Admin only)
router.patch('/:id/approve', protect, restrictTo('admin'), approveHospital);

// ==================
// Hospital management routes
// ==================

// Doctors
router.get('/:id/doctors', protect, getHospitalId, ensureHospitalLink, restrictTo('admin','hospital'), getHospitalDoctors);
router.post('/:id/doctors', protect, getHospitalId, ensureHospitalLink, restrictTo('admin','hospital'), createHospitalDoctor);

// Appointments
router.get('/:id/appointments', protect, getHospitalId, ensureHospitalLink, restrictTo('admin','hospital'), getHospitalAppointments);

module.exports = router;