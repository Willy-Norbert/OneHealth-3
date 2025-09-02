const express = require('express');
const { protect } = require('../middleware/auth');
const { createCheckout, verifyPayment, getPayment } = require('../controllers/paymentController');

const router = express.Router();

// Create a checkout session
router.post('/checkout', protect, createCheckout);

// Verify payment status
router.post('/verify', protect, verifyPayment);

// Get a payment by id
router.get('/:id', protect, getPayment);

module.exports = router;
