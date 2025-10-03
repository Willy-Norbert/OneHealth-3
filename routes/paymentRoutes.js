const express = require('express');
const { protect } = require('../middleware/auth');
const { createCheckout, verifyPayment, getPayment, manualConfirm } = require('../controllers/paymentController');

const router = express.Router();

// Create a checkout session
router.post('/checkout', protect, createCheckout);

// Verify payment status
router.post('/verify', protect, verifyPayment);

// Get a payment by id
router.get('/:id', protect, getPayment);

// Manual confirm (hospital/admin)
router.post('/:paymentId/confirm', protect, manualConfirm);

module.exports = router;
