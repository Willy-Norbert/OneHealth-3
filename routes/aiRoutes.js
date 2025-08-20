const express = require('express');
const {
  symptomChecker,
  appointmentBookingHelper,
  prescriptionHelper,
  referralSupport,
  healthTips
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/ai/symptom-checker:
 *   post:
 *     summary: AI-powered symptom analysis
 *     tags: [AI Assistant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *               severity:
 *                 type: string
 *               duration:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       200:
 *         description: Symptom analysis completed
 */

// All AI routes require authentication
router.use(protect);

router.post('/symptom-checker', symptomChecker);
router.post('/book-appointment-helper', appointmentBookingHelper);
router.post('/prescription-helper', prescriptionHelper);
router.post('/referral-support', referralSupport);
router.post('/health-tips', healthTips);

module.exports = router;