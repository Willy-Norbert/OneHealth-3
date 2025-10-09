const express = require('express');
const {
  createMeeting,
  getMeeting,
  getUserMeetings,
  deleteMeeting,
  updateMeetingStatus
} = require('../controllers/meetingController');
const { generateMeetingLink } = require('../services/jitsiService');
const Meeting = require('../models/Meeting');
const fetch = require('node-fetch');
const { protect } = require('../middleware/auth'); // Removed restrictTo as it's handled in controller

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Meetings
 *   description: Custom WebRTC Meeting management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Meeting:
 *       type: object
 *       required:
 *         - doctor
 *         - patient
 *         - startTime
 *         - endTime
 *       properties:
 *         meeting_id:
 *           type: string
 *           description: Unique identifier for the meeting (UUID)
 *           readOnly: true
 *         doctor:
 *           type: string
 *           description: User ID of the doctor
 *         patient:
 *           type: string
 *           description: User ID of the patient
 *         appointment:
 *           type: string
 *           description: Optional Appointment ID associated with the meeting
 *         link:
 *           type: string
 *           description: Unique private link to join the meeting
 *           readOnly: true
 *         status:
 *           type: string
 *           enum: [scheduled, in-progress, completed, cancelled]
 *           default: scheduled
 *           description: Current status of the meeting
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Scheduled start time of the meeting
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Scheduled end time of the meeting
 *         title:
 *           type: string
 *           description: Optional title for the meeting
 *         description:
 *           type: string
 *           description: Optional description for the meeting
 */

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/meetings:
 *   post:
 *     summary: Create a new WebRTC meeting
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctor
 *               - patient
 *               - startTime
 *               - endTime
 *             properties:
 *               doctor:
 *                 type: string
 *                 description: User ID of the doctor
 *               patient:
 *                 type: string
 *                 description: User ID of the patient
 *               appointment:
 *                 type: string
 *                 description: Optional Appointment ID associated with the meeting
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled start time of the meeting
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Scheduled end time of the meeting
 *               title:
 *                 type: string
 *                 description: Optional title for the meeting
 *               description:
 *                 type: string
 *                 description: Optional description for the meeting
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
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Not authorized to create this type of meeting
 */
router.post('/', createMeeting);

/**
 * @swagger
 * /api/meetings/{meeting_id}:
 *   get:
 *     summary: Get a specific meeting by its unique meeting_id
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Meeting ID (UUID)
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
 * /api/meetings/{meeting_id}:
 *   delete:
 *     summary: Cancel a meeting by its unique meeting_id
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Meeting ID (UUID)
 *     responses:
 *       200:
 *         description: Meeting cancelled successfully
 *       404:
 *         description: Meeting not found
 *       403:
 *         description: Not authorized to cancel this meeting
 */
router.delete('/:id', deleteMeeting);

/**
 * @swagger
 * /api/meetings/{meeting_id}/status:
 *   patch:
 *     summary: Update meeting status by its unique meeting_id
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: meeting_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique Meeting ID (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, in-progress, completed, cancelled]
 *                 description: New status for the meeting
 *               notes:
 *                 type: string
 *                 description: Optional notes about the status update
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
 *     summary: Get all meetings for a user (as doctor or patient)
 *     tags: [Meetings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID of the doctor or patient
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
 *           enum: [scheduled, in-progress, completed, cancelled]
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

// Create a secure join link (JWT if configured) for a meeting_id
router.post('/:id/join-link', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meeting_id: req.params.id }).populate(['doctor','patient']);
    if (!meeting) return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    const uid = String(req.user._id);
    const allowed = [String(meeting.doctor?._id || meeting.doctor), String(meeting.patient?._id || meeting.patient)];
    if (!allowed.includes(uid) && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Not authorized for this meeting' });
    }
    const roomName = `meeting-${meeting._id}`;
    const details = generateMeetingLink({ roomName, user: req.user });
    return res.status(200).json({ status: 'success', data: { joinUrl: details.meetingLink, room: details.roomName, domain: details.domain } });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// Generate fresh TURN credentials via Twilio Network Traversal API
// POST /api/meetings/get-turn-token
router.post('/get-turn-token', async (req, res) => {
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
      return res.status(500).json({ status: 'error', message: 'TURN not configured' });
    }
    // Optional auth: require logged-in user
    if (!req.user) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Tokens.json`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: '' // no params needed for default TTL
    });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(resp.status).json({ status: 'error', message: txt });
    }
    const data = await resp.json();
    // Twilio returns ice_servers array with urls/username/credential
    const servers = (data.ice_servers || []).filter(s => s.urls);
    const urls = servers.map(s => (Array.isArray(s.urls) ? s.urls : [s.urls])).flat().join(',');
    const user = servers.find(s => s.username)?.username || '';
    const pass = servers.find(s => s.credential)?.credential || '';
    return res.status(200).json({
      status: 'success',
      data: {
        WEBRTC_TURN_URLS: urls,
        WEBRTC_TURN_USER: user,
        WEBRTC_TURN_PASS: pass
      }
    });
  } catch (e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

module.exports = router;