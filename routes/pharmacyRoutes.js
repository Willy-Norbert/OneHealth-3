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
 * tags:
 *   name: Pharmacies
 *   description: Pharmacy management
 * components:
 *   schemas:
 *     Pharmacy:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         location:
 *           type: object
 *         contact:
 *           type: object
 *         insuranceAccepted:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/pharmacies:
 *   get:
 *     summary: Get all pharmacies
 *     tags: [Pharmacies]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *     responses:
 *       200: { description: Pharmacies retrieved }
 *   post:
 *     summary: Create a pharmacy (Admin)
 *     tags: [Pharmacies]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
router.get('/', getAllPharmacies);
router.get('/near', getPharmaciesNear);
router.get('/:id', getPharmacy);

router.use(protect);
router.post('/', restrictTo('admin'), createPharmacy);
router.put('/:id', updatePharmacy); // Admin or owner enforced in controller
router.delete('/:id', restrictTo('admin'), deletePharmacy);

module.exports = router;
