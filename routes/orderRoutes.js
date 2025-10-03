const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const {
  getAllOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getPatientOrders,
} = require('../controllers/orderController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Pharmacy order management
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 *   post:
 *     summary: Create new order (Patient)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Created }
 */
router.use(protect);
router.get('/', restrictTo('admin'), getAllOrders);
router.post('/', restrictTo('patient'), createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get single order
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/:id', getOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id/status', restrictTo('admin'), updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     summary: Cancel order (Patient/Admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/:id/cancel', cancelOrder);

/**
 * @swagger
 * /api/patients/{patientId}/orders:
 *   get:
 *     summary: Get patient orders
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/patients/:patientId/orders', getPatientOrders);

module.exports = router;
