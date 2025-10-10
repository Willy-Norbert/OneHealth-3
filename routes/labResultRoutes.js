const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');
const {
  getAllLabResults,
  getLabResult,
  createLabResult,
  updateLabResult,
  verifyLabResult,
  getCriticalLabResults,
  getLabStatistics,
  deleteLabResult
} = require('../controllers/labResultController');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     LabResult:
 *       type: object
 *       required:
 *         - patient
 *         - doctor
 *         - hospital
 *         - testType
 *         - testName
 *         - collectionDate
 *       properties:
 *         patient:
 *           type: string
 *           description: Patient ID
 *         doctor:
 *           type: string
 *           description: Doctor ID
 *         hospital:
 *           type: string
 *           description: Hospital ID
 *         testType:
 *           type: string
 *           enum: [blood_test, urine_test, stool_test, culture, biopsy, imaging, cardiac_test, pulmonary_test, neurological_test, other]
 *         testName:
 *           type: string
 *           description: Name of the test
 *         results:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               parameter:
 *                 type: string
 *               value:
 *                 type: string
 *               unit:
 *                 type: string
 *               referenceRange:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [normal, high, low, critical, abnormal]
 *         overallStatus:
 *           type: string
 *           enum: [normal, abnormal, critical, pending]
 *         interpretation:
 *           type: string
 *         recommendations:
 *           type: string
 *         collectionDate:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 */

/**
 * @swagger
 * /lab-results:
 *   get:
 *     summary: Get all lab results
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: patient
 *         schema:
 *           type: string
 *       - in: query
 *         name: doctor
 *         schema:
 *           type: string
 *       - in: query
 *         name: hospital
 *         schema:
 *           type: string
 *       - in: query
 *         name: testType
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: overallStatus
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lab results retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', getAllLabResults);

/**
 * @swagger
 * /lab-results/critical:
 *   get:
 *     summary: Get critical lab results
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Critical lab results retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/critical', getCriticalLabResults);

/**
 * @swagger
 * /lab-results/statistics:
 *   get:
 *     summary: Get lab result statistics
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hospitalId
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/statistics', getLabStatistics);

/**
 * @swagger
 * /lab-results:
 *   post:
 *     summary: Create new lab result
 *     tags: [Lab Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LabResult'
 *     responses:
 *       201:
 *         description: Lab result created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', 
  restrictTo('admin', 'doctor', 'hospital'),
  createLabResult
);

/**
 * @swagger
 * /lab-results/{id}:
 *   get:
 *     summary: Get lab result by ID
 *     tags: [Lab Results]
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
 *         description: Lab result retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lab result not found
 */
router.get('/:id', getLabResult);

/**
 * @swagger
 * /lab-results/{id}:
 *   put:
 *     summary: Update lab result
 *     tags: [Lab Results]
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
 *             $ref: '#/components/schemas/LabResult'
 *     responses:
 *       200:
 *         description: Lab result updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lab result not found
 */
router.put('/:id', 
  restrictTo('admin', 'doctor', 'hospital'),
  updateLabResult
);

/**
 * @swagger
 * /lab-results/{id}/verify:
 *   patch:
 *     summary: Verify lab result
 *     tags: [Lab Results]
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
 *               comments:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lab result verified successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lab result not found
 */
router.patch('/:id/verify', 
  restrictTo('admin', 'doctor'),
  verifyLabResult
);

/**
 * @swagger
 * /lab-results/{id}:
 *   delete:
 *     summary: Delete lab result
 *     tags: [Lab Results]
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
 *         description: Lab result deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Lab result not found
 */
router.delete('/:id', 
  restrictTo('admin', 'doctor'),
  deleteLabResult
);

module.exports = router;
































