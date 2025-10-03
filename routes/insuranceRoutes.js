const express = require('express');
const {
  getAllInsurance,
  getInsurance,
  createInsurance,
  updateInsurance,
  deleteInsurance
} = require('../controllers/insuranceController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Insurance
 *   description: Insurance providers management
 */

/**
 * @swagger
 * /api/insurance:
 *   get:
 *     summary: Get all insurance providers
 *     tags: [Insurance]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Public, Private]
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Insurance providers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     insuranceProviders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Insurance'
 *   post:
 *     summary: Create new insurance provider (Admin only)
 *     tags: [Insurance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Insurance'
 *     responses:
 *       201:
 *         description: Insurance provider created successfully
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/insurance/{id}:
 *   get:
 *     summary: Get single insurance provider
 *     tags: [Insurance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Insurance provider retrieved successfully
 *       404:
 *         description: Insurance provider not found
 *   put:
 *     summary: Update insurance provider (Admin only)
 *     tags: [Insurance]
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
 *             $ref: '#/components/schemas/Insurance'
 *     responses:
 *       200:
 *         description: Insurance provider updated successfully
 *       404:
 *         description: Insurance provider not found
 *       403:
 *         description: Admin access required
 *   delete:
 *     summary: Delete insurance provider (Admin only)
 *     tags: [Insurance]
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
 *         description: Insurance provider deleted successfully
 *       404:
 *         description: Insurance provider not found
 *       403:
 *         description: Admin access required
 */

// Public routes
router.get('/', getAllInsurance);
router.get('/:id', getInsurance);

// Admin routes
router.use(protect);
router.use(restrictTo('admin'));
router.post('/', createInsurance);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

module.exports = router;