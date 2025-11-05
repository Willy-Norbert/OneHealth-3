const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

// Helper to avoid boot-time crashes if a handler is undefined
function getHandler(name) {
  const fn = patientController && patientController[name];
  if (typeof fn === 'function') return fn;
  return (req, res, next) => {
    console.error(`[patients] Handler missing: ${name}`);
    return res.status(500).json({ success: false, message: `${name} handler missing` });
  };
}

const router = express.Router();

// Public endpoint for stats
router.get('/count', patientController.getPatientsCount);

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patient management operations
 * 
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f8b2c8e1234567890abcde"
 *         user:
 *           type: string
 *           example: "64f8b2c8e1234567890abcdf"
 *         patientId:
 *           type: string
 *           example: "PAT-2023-000001"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-05-15"
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *           example: "Male"
 *         bloodType:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *           example: "O+"
 *         phone:
 *           type: string
 *           example: "+250788123456"
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             district:
 *               type: string
 *         emergencyContact:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             relationship:
 *               type: string
 *             phone:
 *               type: string
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *         chronicConditions:
 *           type: array
 *           items:
 *             type: string
 *         insurance:
 *           type: object
 *           properties:
 *             provider:
 *               type: string
 *             policyNumber:
 *               type: string
 *             coveragePercentage:
 *               type: number
 *         primaryHospital:
 *           type: string
 *           example: "64f8b2c8e1234567890abce0"
 *         isActive:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-09-06T10:00:00Z"
 *     CreatePatientRequest:
 *       type: object
 *       required: [dateOfBirth, gender, phone, emergencyContact]
 *       properties:
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-05-15"
 *         gender:
 *           type: string
 *           enum: [Male, Female, Other]
 *           example: "Male"
 *         bloodType:
 *           type: string
 *           enum: [A+, A-, B+, B-, AB+, AB-, O+, O-]
 *           example: "O+"
 *         phone:
 *           type: string
 *           example: "+250788123456"
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: "123 Main St"
 *             city:
 *               type: string
 *               example: "Kigali"
 *             district:
 *               type: string
 *               example: "Gasabo"
 *         emergencyContact:
 *           type: object
 *           required: [name, relationship, phone]
 *           properties:
 *             name:
 *               type: string
 *               example: "Jane Doe"
 *             relationship:
 *               type: string
 *               example: "Spouse"
 *             phone:
 *               type: string
 *               example: "+250788654321"
 *         allergies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Penicillin", "Nuts"]
 *         primaryHospital:
 *           type: string
 *           example: "64f8b2c8e1234567890abce0"
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients with filtering
 *     tags: [Patients]
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
 *         description: Number of patients per page
 *       - in: query
 *         name: hospital
 *         schema:
 *           type: string
 *         description: Filter by hospital ID (Admin only)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name or email
 *     responses:
 *       200:
 *         description: Patients retrieved successfully
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
 *                   example: "Patients retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     patients:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Patient'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalPatients:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin or Hospital access required
 *   post:
 *     summary: Create patient profile
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientRequest'
 *     responses:
 *       201:
 *         description: Patient profile created successfully
 *       400:
 *         description: Patient profile already exists or validation error
 *       403:
 *         description: Only patients can create their own profile
 */

/**
 * @swagger
 * /api/patients/my-patients:
 *   get:
 *     summary: Get patients assigned to the logged-in doctor
 *     tags: [Patients]
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
 *         description: Number of patients per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by patient name or email
 *     responses:
 *       200:
 *         description: Doctor's patients retrieved successfully
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
 *                   example: "Doctor's patients retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     patients:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Patient'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalPatients:
 *                           type: integer
 *                         hasNext:
 *                           type: boolean
 *                         hasPrev:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Doctor access required
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient details
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient retrieved successfully
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
 *                   example: "Patient retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     patient:
 *                       $ref: '#/components/schemas/Patient'
 *                     recentAppointments:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Patient not found
 *       403:
 *         description: Not authorized to view this patient
 *   put:
 *     summary: Update patient profile
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePatientRequest'
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Not authorized to update this patient
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * /api/hospitals/{hospitalId}/patients:
 *   get:
 *     summary: Get patients by hospital
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hospitalId
 *         required: true
 *         schema:
 *           type: string
 *         description: Hospital ID
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
 *         description: Number of patients per page
 *     responses:
 *       200:
 *         description: Hospital patients retrieved successfully
 *       403:
 *         description: Can only access your own hospital patients
 */

/**
 * @swagger
 * /api/patients/{id}/visits:
 *   post:
 *     summary: Add hospital visit to patient record
 *     tags: [Patients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [hospitalId]
 *             properties:
 *               hospitalId:
 *                 type: string
 *                 example: "64f8b2c8e1234567890abce0"
 *     responses:
 *       200:
 *         description: Hospital visit added successfully
 *       404:
 *         description: Patient not found
 *       403:
 *         description: Can only access your own hospital patients
 */

// Public patient registration (multipart) with safe fallbacks to avoid boot-time crashes
const safePatientRegisterUpload = typeof patientController.patientRegisterUpload === 'function'
  ? patientController.patientRegisterUpload
  : (req, res, next) => { console.error('[patients/register] upload middleware missing'); next(); };

// Clean registration route without verbose logging
router.post('/register', safePatientRegisterUpload, getHandler('publicRegisterPatient'));

// Test route to verify the endpoint is accessible
router.get('/register/test', (req, res) => {
  console.log('=== PATIENT REGISTER TEST ===');
  res.json({ message: 'Patient register endpoint is accessible', timestamp: new Date().toISOString() });
});

// Development route to clear test data (only in development)
if (process.env.NODE_ENV !== 'production') {
  router.delete('/register/clear-test-data', async (req, res) => {
    try {
      const User = require('../models/User');
      const Patient = require('../models/Patient');
      
      // Delete test users (be careful with this!)
      const testUsers = await User.find({ email: { $regex: /test|demo|example/i } });
      const userIds = testUsers.map(u => u._id);
      
      await User.deleteMany({ _id: { $in: userIds } });
      await Patient.deleteMany({ user: { $in: userIds } });
      
      res.json({ 
        message: 'Test data cleared', 
        deletedUsers: testUsers.length,
        deletedPatients: userIds.length 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// Protect all routes
router.use(protect);

// Patient routes
router.get('/', restrictTo('admin', 'hospital'), getHandler('getAllPatients'));
router.post('/', restrictTo('admin', 'patient'), getHandler('createPatient'));
router.get('/my-patients', restrictTo('doctor'), getHandler('getDoctorPatients'));
router.get('/:id', restrictTo('admin', 'hospital', 'doctor', 'patient'), getHandler('getPatient'));
router.put('/:id', getHandler('updatePatient'));
router.post('/:id/visits', restrictTo('admin', 'hospital'), getHandler('addHospitalVisit'));

// Hospital-specific patient routes (defined in hospital routes)
router.get('/hospital/:hospitalId', restrictTo('admin', 'hospital'), getHandler('getPatientsByHospital'));

module.exports = router;