const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllPharmacies,
  getPharmacy,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getPharmaciesNear,
} = require('../controllers/pharmacyController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pharmacy:
 *       type: object
 *       required:
 *         - name
 *         - location
 *         - contact
 *       properties:
 *         name:
 *           type: string
 *           description: Pharmacy name
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             coordinates:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *         contact:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *         services:
 *           type: array
 *           items:
 *             type: string
 *         operatingHours:
 *           type: object
 *         insuranceAccepted:
 *           type: array
 *           items:
 *             type: string
 *             description: Insurance provider IDs
 */

/**
 * @swagger
 * tags:
 *   name: Pharmacies
 *   description: Pharmacy management endpoints
 */

/**
 * @swagger
 * /api/pharmacies:
 *   get:
 *     summary: Get all pharmacies with filtering and pagination
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Pharmacies retrieved successfully
 *   post:
 *     summary: Create new pharmacy (Admin only)
 *     tags: [Pharmacies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pharmacy'
 *     responses:
 *       201:
 *         description: Pharmacy created successfully
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/pharmacies/{id}:
 *   get:
 *     summary: Get single pharmacy
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pharmacy retrieved successfully
 *       404:
 *         description: Pharmacy not found
 *   put:
 *     summary: Update pharmacy (Admin or Owner)
 *     tags: [Pharmacies]
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
 *             $ref: '#/components/schemas/Pharmacy'
 *     responses:
 *       200:
 *         description: Pharmacy updated successfully
 *       404:
 *         description: Pharmacy not found
 *       403:
 *         description: Not authorized to update this pharmacy
 *   delete:
 *     summary: Delete pharmacy (Admin only)
 *     tags: [Pharmacies]
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
 *         description: Pharmacy deleted successfully
 *       404:
 *         description: Pharmacy not found
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/pharmacies/near:
 *   get:
 *     summary: Get pharmacies near location
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *     responses:
 *       200:
 *         description: Nearby pharmacies retrieved successfully
 *       400:
 *         description: Latitude and longitude required
 */

router.get('/', getAllPharmacies);
router.get('/near', getPharmaciesNear);
router.get('/:id', getPharmacy);

router.use(protect);
router.post('/', restrictTo('admin'), createPharmacy);
router.put('/:id', updatePharmacy); // Admin or owner enforced in controller
router.delete('/:id', restrictTo('admin'), deletePharmacy);

module.exports = router;
