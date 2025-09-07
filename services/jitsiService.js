const crypto = require('crypto');

// Jitsi configuration
// JITSI_APP_ID and JITSI_SECRET are no longer needed for public Jitsi without JWT
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

// generateJitsiJWT is no longer needed for public Jitsi without JWT

/**
 * Generate complete Jitsi meeting link without JWT
 * @param {Object} options - Meeting options
 * @param {string} options.roomName - Room name
 * @returns {Object} Meeting details with link
 */
const generateMeetingLink = (options) => {
  const { roomName } = options;
  
  const meetingLink = `https://${JITSI_DOMAIN}/${roomName}`;

  return {
    roomName,
    meetingLink,
    domain: JITSI_DOMAIN
  };
};

/**
 * Generate meeting link for appointments
 * @param {Object} appointment - Appointment object
 * @returns {Object} Meeting details
 */
const generateAppointmentMeeting = (appointment) => {
  const roomName = generateRoomName('appointment', appointment._id);
  
  return generateMeetingLink({
    roomName
  });
};

/**
 * Generate meeting link for custom meetings
 * @param {Object} meeting - Meeting object
 * @returns {Object} Meeting details
 */
const generateCustomMeeting = (meeting) => {
  const roomName = generateRoomName('meeting', meeting._id);
  
  return generateMeetingLink({
    roomName
  });
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