const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { validationRules } = require('../middleware/validation');
const {
  checkDrugInteractions,
  getAllDrugInteractions,
  getDrugInteraction,
  createDrugInteraction,
  updateDrugInteraction,
  verifyDrugInteraction,
  getCriticalDrugInteractions,
  getInteractionsByDrug,
  getDrugInteractionStatistics,
  deleteDrugInteraction,
  bulkImportDrugInteractions
} = require('../controllers/drugInteractionController');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     DrugInteraction:
 *       type: object
 *       required:
 *         - drug1
 *         - drug2
 *         - interactionType
 *         - severity
 *         - description
 *         - mechanism
 *         - management
 *       properties:
 *         drug1:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             genericName:
 *               type: string
 *             brandNames:
 *               type: array
 *               items:
 *                 type: string
 *             drugClass:
 *               type: string
 *         drug2:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             genericName:
 *               type: string
 *             brandNames:
 *               type: array
 *               items:
 *                 type: string
 *             drugClass:
 *               type: string
 *         interactionType:
 *           type: string
 *           enum: [pharmacokinetic, pharmacodynamic, pharmaceutical, other]
 *         severity:
 *           type: string
 *           enum: [minor, moderate, major, contraindicated]
 *         clinicalSignificance:
 *           type: string
 *           enum: [low, moderate, high, critical]
 *         description:
 *           type: string
 *         mechanism:
 *           type: string
 *         clinicalEffects:
 *           type: array
 *           items:
 *             type: string
 *         management:
 *           type: string
 *         alternatives:
 *           type: array
 *           items:
 *             type: string
 *         monitoring:
 *           type: object
 *           properties:
 *             required:
 *               type: boolean
 *             parameters:
 *               type: array
 *               items:
 *                 type: string
 *             frequency:
 *               type: string
 *             duration:
 *               type: string
 */

/**
 * @swagger
 * /drug-interactions/check:
 *   post:
 *     summary: Check drug interactions for medications
 *     tags: [Drug Interactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - medications
 *             properties:
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     dosage:
 *                       type: string
 *                     frequency:
 *                       type: string
 *     responses:
 *       200:
 *         description: Drug interactions checked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/check', checkDrugInteractions);

/**
 * @swagger
 * /drug-interactions:
 *   get:
 *     summary: Get all drug interactions
 *     tags: [Drug Interactions]
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
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [minor, moderate, major, contraindicated]
 *       - in: query
 *         name: interactionType
 *         schema:
 *           type: string
 *           enum: [pharmacokinetic, pharmacodynamic, pharmaceutical, other]
 *       - in: query
 *         name: clinicalSignificance
 *         schema:
 *           type: string
 *           enum: [low, moderate, high, critical]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drug interactions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', getAllDrugInteractions);

/**
 * @swagger
 * /drug-interactions/critical:
 *   get:
 *     summary: Get critical drug interactions
 *     tags: [Drug Interactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Critical drug interactions retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/critical', getCriticalDrugInteractions);

/**
 * @swagger
 * /drug-interactions/statistics:
 *   get:
 *     summary: Get drug interaction statistics
 *     tags: [Drug Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *           enum: [minor, moderate, major, contraindicated]
 *       - in: query
 *         name: interactionType
 *         schema:
 *           type: string
 *           enum: [pharmacokinetic, pharmacodynamic, pharmaceutical, other]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/statistics', getDrugInteractionStatistics);

/**
 * @swagger
 * /drug-interactions/drug/{drugName}:
 *   get:
 *     summary: Get interactions by drug name
 *     tags: [Drug Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: drugName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Drug interactions retrieved successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.get('/drug/:drugName', getInteractionsByDrug);

/**
 * @swagger
 * /drug-interactions:
 *   post:
 *     summary: Create new drug interaction
 *     tags: [Drug Interactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DrugInteraction'
 *     responses:
 *       201:
 *         description: Drug interaction created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Drug interaction already exists
 */
router.post('/', 
  restrictTo('admin', 'doctor'),
  createDrugInteraction
);

/**
 * @swagger
 * /drug-interactions/bulk-import:
 *   post:
 *     summary: Bulk import drug interactions
 *     tags: [Drug Interactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - interactions
 *             properties:
 *               interactions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/DrugInteraction'
 *     responses:
 *       200:
 *         description: Drug interactions imported successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/bulk-import', 
  restrictTo('admin'),
  bulkImportDrugInteractions
);

/**
 * @swagger
 * /drug-interactions/{id}:
 *   get:
 *     summary: Get drug interaction by ID
 *     tags: [Drug Interactions]
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
 *         description: Drug interaction retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Drug interaction not found
 */
router.get('/:id', getDrugInteraction);

/**
 * @swagger
 * /drug-interactions/{id}:
 *   put:
 *     summary: Update drug interaction
 *     tags: [Drug Interactions]
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
 *             $ref: '#/components/schemas/DrugInteraction'
 *     responses:
 *       200:
 *         description: Drug interaction updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Drug interaction not found
 */
router.put('/:id', 
  restrictTo('admin', 'doctor'),
  updateDrugInteraction
);

/**
 * @swagger
 * /drug-interactions/{id}/verify:
 *   patch:
 *     summary: Verify drug interaction
 *     tags: [Drug Interactions]
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
 *         description: Drug interaction verified successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Drug interaction not found
 */
router.patch('/:id/verify', 
  restrictTo('admin', 'doctor'),
  verifyDrugInteraction
);

/**
 * @swagger
 * /drug-interactions/{id}:
 *   delete:
 *     summary: Delete drug interaction
 *     tags: [Drug Interactions]
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
 *         description: Drug interaction deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Drug interaction not found
 */
router.delete('/:id', 
  restrictTo('admin'),
  deleteDrugInteraction
);

module.exports = router;



































