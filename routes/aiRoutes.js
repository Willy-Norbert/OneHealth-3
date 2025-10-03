const express = require('express');
const {
  symptomChecker,
  appointmentBookingHelper,
  prescriptionHelper,
  referralSupport,
  healthTips,
  generalChat
} = require('../controllers/aiController');
const { saveMessages, getHistory, listConversations, createConversation, renameConversation, deleteConversation } = require('../controllers/aiChatController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AI Assistant
 *   description: AI-powered healthcare assistance
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SymptomAnalysis:
 *       type: object
 *       properties:
 *         symptoms:
 *           type: array
 *           items:
 *             type: string
 *         severity:
 *           type: string
 *           enum: [mild, moderate, severe]
 *         duration:
 *           type: string
 *         age:
 *           type: number
 *         existingConditions:
 *           type: array
 *           items:
 *             type: string
 */

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
 *             $ref: '#/components/schemas/SymptomAnalysis'
 *     responses:
 *       200:
 *         description: Symptom analysis completed
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 */

/**
 * @swagger
 * /api/ai/book-appointment-helper:
 *   post:
 *     summary: AI guidance for booking appointments
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
 *               preferredLocation:
 *                 type: string
 *               insuranceType:
 *                 type: string
 *               urgency:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Appointment booking guidance provided
 */

/**
 * @swagger
 * /api/ai/prescription-helper:
 *   post:
 *     summary: AI assistance for understanding prescriptions
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
 *               medicationName:
 *                 type: string
 *               questions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Prescription guidance provided
 */

/**
 * @swagger
 * /api/ai/referral-support:
 *   post:
 *     summary: AI support for medical referrals
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
 *               condition:
 *                 type: string
 *               currentTreatment:
 *                 type: string
 *               location:
 *                 type: string
 *               insuranceType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Referral guidance provided
 */

/**
 * @swagger
 * /api/ai/health-tips:
 *   post:
 *     summary: AI-generated personalized health tips
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
 *               category:
 *                 type: string
 *               condition:
 *                 type: string
 *               age:
 *                 type: number
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Health tips provided
 */

// All AI routes require authentication
router.use(protect);

router.post('/symptom-checker', symptomChecker);
router.post('/book-appointment-helper', appointmentBookingHelper);
router.post('/prescription-helper', prescriptionHelper);
router.post('/referral-support', referralSupport);
router.post('/health-tips', healthTips);
router.post('/chat-general', generalChat);

// Chat history endpoints
router.post('/chat/save', saveMessages);
router.get('/chat/history', getHistory);
router.get('/chat/conversations', listConversations);
router.post('/chat/conversations', createConversation);
router.patch('/chat/conversations/:id', renameConversation);
router.delete('/chat/conversations/:id', deleteConversation);

module.exports = router;