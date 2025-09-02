const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Jitsi configuration
const JITSI_APP_ID = process.env.JITSI_APP_ID || 'your-jitsi-app-id';
const JITSI_SECRET = process.env.JITSI_SECRET || 'your-jitsi-secret-key';
const JITSI_DOMAIN = process.env.JITSI_DOMAIN || 'meet.jit.si';

/**
 * Generate a unique room name for meetings
 * @param {string} prefix - Room prefix (appointment, meeting, etc.)
 * @param {string} id - Unique identifier
 * @returns {string} Unique room name
 */
const generateRoomName = (prefix, id) => {
  const randomString = crypto.randomBytes(8).toString('hex');
  return `${prefix}-${id}-${randomString}`;
};

/**
 * Generate JWT token for Jitsi authentication
 * @param {Object} options - JWT options
 * @param {string} options.room - Room name
 * @param {string} options.userId - User ID
 * @param {string} options.userName - User display name
 * @param {string} options.userEmail - User email
 * @param {boolean} options.moderator - Whether user is moderator
 * @param {number} options.exp - Token expiration (timestamp)
 * @returns {string} JWT token
 */
const generateJitsiJWT = (options) => {
  const {
    room,
    userId,
    userName,
    userEmail,
    moderator = false,
    exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours default
  } = options;

  const payload = {
    iss: JITSI_APP_ID,
    sub: JITSI_DOMAIN,
    aud: JITSI_APP_ID,
    exp,
    nbf: Math.floor(Date.now() / 1000) - 10,
    room,
    context: {
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        moderator
      },
      features: {
        livestreaming: false,
        recording: false,
        transcription: false,
        'outbound-call': false
      }
    }
  };

  return jwt.sign(payload, JITSI_SECRET, { algorithm: 'HS256' });
};

/**
 * Generate complete Jitsi meeting link with JWT
 * @param {Object} options - Meeting options
 * @param {string} options.roomName - Room name
 * @param {string} options.userId - User ID
 * @param {string} options.userName - User display name
 * @param {string} options.userEmail - User email
 * @param {boolean} options.moderator - Whether user is moderator
 * @returns {Object} Meeting details with JWT and link
 */
const generateMeetingLink = (options) => {
  const { roomName, userId, userName, userEmail, moderator = false } = options;
  
  const jwtToken = generateJitsiJWT({
    room: roomName,
    userId,
    userName,
    userEmail,
    moderator
  });

  const meetingLink = `https://${JITSI_DOMAIN}/${roomName}?jwt=${jwtToken}`;

  return {
    roomName,
    jwtToken,
    meetingLink,
    domain: JITSI_DOMAIN
  };
};

/**
 * Generate meeting link for appointments
 * @param {Object} appointment - Appointment object
 * @param {Object} user - User object (patient or doctor)
 * @param {boolean} isModerator - Whether user is moderator
 * @returns {Object} Meeting details
 */
const generateAppointmentMeeting = (appointment, user, isModerator = false) => {
  const roomName = generateRoomName('appointment', appointment._id);
  
  return generateMeetingLink({
    roomName,
    userId: user._id.toString(),
    userName: user.fullName || user.name || 'User',
    userEmail: user.email,
    moderator: isModerator
  });
};

/**
 * Generate meeting link for custom meetings
 * @param {Object} meeting - Meeting object
 * @param {Object} user - User object
 * @param {boolean} isModerator - Whether user is moderator
 * @returns {Object} Meeting details
 */
const generateCustomMeeting = (meeting, user, isModerator = false) => {
  const roomName = generateRoomName('meeting', meeting._id);
  
  return generateMeetingLink({
    roomName,
    userId: user._id.toString(),
    userName: user.fullName || user.name || 'User',
    userEmail: user.email,
    moderator: isModerator
  });
};

/**
 * Validate if user can join a specific room
 * @param {string} roomName - Room name
 * @param {string} userId - User ID
 * @param {Object} meeting - Meeting/Appointment object
 * @returns {boolean} Whether user can join
 */
const canUserJoinRoom = (roomName, userId, meeting) => {
  // Check if user is participant in the meeting/appointment
  const participants = [
    meeting.patient?.toString(),
    meeting.doctor?.toString(),
    meeting.createdBy?.toString(),
    ...(meeting.participants || []).map(p => p.toString())
  ].filter(Boolean);

  return participants.includes(userId.toString());
};

module.exports = {
  generateRoomName,
  generateJitsiJWT,
  generateMeetingLink,
  generateAppointmentMeeting,
  generateCustomMeeting,
  canUserJoinRoom
};