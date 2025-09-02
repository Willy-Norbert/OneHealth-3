const express = require('express');
const {
  createMeeting,
  getMeeting,
  getUserMeetings,
  deleteMeeting,
  updateMeetingStatus
} = require('../controllers/meetingController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description: Custom meeting management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Meeting:
 *       type: object
 *       required:
 *         - participants
 *         - title
 *       properties:
 *         participants:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of participant user IDs
 *         roleContext:
 *           type: string
 *           enum: [patient-doctor, doctor-hospital, hospital-admin, doctor-doctor, custom]
 *           default: custom
 *         title:
 *           type: string
 *           description: Meeting title
 *         description:
 *           type: string
 *           description: Meeting description
 *         scheduledAt:
 *           type: string
 *           format: date-time
 *           description: Scheduled meeting time
 *         meetingType:
 *           type: string
 *           enum: [video, audio, chat]
 *           default: video
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new custom meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Meeting'
 *     responses:
 *       201:
 *         description: Meeting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Meeting created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     meeting:
 *                       $ref: '#/components/schemas/Meeting'
 *                     jitsiDetails:
 *                       type: object
 *                       properties:
 *                         meetingLink:
 *                           type: string
 *                         roomName:
 *                           type: string
 *                         domain:
 *                           type: string
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Not authorized to create this type of meeting
 */
router.post('/', createMeeting);

/**
 * @swagger
 * /api/meetings/{id}:
 *   get:
 *     summary: Get a specific meeting by ID
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     meeting:
 *                       $ref: '#/components/schemas/Meeting'
 *       404:
 *         description: Meeting not found
 *       403:
 *         description: Not authorized to view this meeting
 */
router.get('/:id', getMeeting);

/**
 * @swagger
 * /api/meetings/{id}:
 *   delete:
 *     summary: Cancel/delete a meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     responses:
 *       200:
 *         description: Meeting cancelled successfully
 *       404:
 *         description: Meeting not found
 *       403:
 *         description: Not authorized to delete this meeting
 */
router.delete('/:id', deleteMeeting);

/**
 * @swagger
 * /api/meetings/{id}/status:
 *   patch:
 *     summary: Update meeting status
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Meeting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, active, completed, cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Meeting status updated successfully
 *       404:
 *         description: Meeting not found
 *       403:
 *         description: Not authorized to update this meeting
 */
router.patch('/:id/status', updateMeetingStatus);

/**
 * @swagger
 * /api/meetings/user/{userId}:
 *   get:
 *     summary: Get all meetings for a user
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, active, completed, cancelled]
 *         description: Filter by meeting status
 *     responses:
 *       200:
 *         description: User meetings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     meetings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Meeting'
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       403:
 *         description: Not authorized to view these meetings
 */
router.get('/user/:userId', getUserMeetings);

module.exports = router;