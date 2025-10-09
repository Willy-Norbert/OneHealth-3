const crypto = require('crypto');

// Jitsi configuration
const JITSI_DOMAIN = process.env.JITSI_DOMAIN || 'meet.jit.si';
const JITSI_APP_ID = process.env.JITSI_APP_ID || '';
const JITSI_SECRET = process.env.JITSI_SECRET || '';
const USE_JWT = Boolean(JITSI_APP_ID && JITSI_SECRET);

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

// Optional: JWT for secured Jitsi deployments
function generateJitsiJWT(roomName, user) {
  if (!USE_JWT) return null;
  const jwt = require('jsonwebtoken');
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 10 * 60; // 10 minutes
  const payload = {
    aud: 'jitsi',
    iss: JITSI_APP_ID,
    sub: JITSI_DOMAIN,
    room: roomName,
    exp,
    nbf: now - 10,
    context: {
      user: {
        name: user?.name || 'User',
        email: user?.email || undefined,
        avatar: user?.profileImageUrl || user?.profileImage || undefined,
        id: String(user?._id || ''),
      }
    }
  };
  return jwt.sign(payload, JITSI_SECRET, { algorithm: 'HS256' });
}

/**
 * Generate complete Jitsi meeting link without JWT
 * @param {Object} options - Meeting options
 * @param {string} options.roomName - Room name
 * @returns {Object} Meeting details with link
 */
const generateMeetingLink = (options) => {
  const { roomName, user } = options;
  const token = generateJitsiJWT(roomName, user);
  const base = `https://${JITSI_DOMAIN}/${roomName}`;
  const meetingLink = token ? `${base}?jwt=${token}` : base;
  return { roomName, meetingLink, domain: JITSI_DOMAIN, token: token || undefined };
};

/**
 * Generate meeting link for appointments
 * @param {Object} appointment - Appointment object
 * @returns {Object} Meeting details
 */
const generateAppointmentMeeting = (appointment, user) => {
  const roomName = generateRoomName('appointment', appointment._id);
  return generateMeetingLink({ roomName, user });
};

/**
 * Generate meeting link for custom meetings
 * @param {Object} meeting - Meeting object
 * @returns {Object} Meeting details
 */
const generateCustomMeeting = (meeting, user) => {
  const roomName = generateRoomName('meeting', meeting._id);
  return generateMeetingLink({ roomName, user });
};

/**
 * Validate if user can join a specific room
 * NOTE: With public Jitsi, this check is less critical for the meeting itself,
 * but can still be used for internal authorization within the application.
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
  // generateJitsiJWT, // Removed
  generateMeetingLink,
  generateAppointmentMeeting,
  generateCustomMeeting,
  canUserJoinRoom
};