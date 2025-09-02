const Meeting = require('../models/Meeting');
const User = require('../models/User');
const { 
  generateCustomMeeting,
  canUserJoinRoom 
} = require('../services/jitsiService');
const Joi = require('joi');

/**
 * Create a new custom meeting
 * POST /api/meetings
 */
exports.createMeeting = async (req, res) => {
  try {
    const schema = Joi.object({
      participants: Joi.array().items(Joi.string()).min(1).required(),
      roleContext: Joi.string().valid('patient-doctor', 'doctor-hospital', 'hospital-admin', 'doctor-doctor', 'custom').default('custom'),
      title: Joi.string().required(),
      description: Joi.string().allow(''),
      scheduledAt: Joi.date().optional(),
      meetingType: Joi.string().valid('video', 'audio', 'chat').default('video')
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }

    const { participants, roleContext, title, description, scheduledAt, meetingType } = value;

    // Verify all participants exist
    const participantUsers = await User.find({ 
      _id: { $in: participants } 
    });

    if (participantUsers.length !== participants.length) {
      return res.status(400).json({
        status: 'error',
        message: 'One or more participants not found'
      });
    }

    // Check authorization based on role context
    if (!canCreateMeeting(req.user, participantUsers, roleContext)) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to create this type of meeting'
      });
    }

    // Create meeting record
    const meetingData = {
      createdBy: req.user._id,
      participants,
      roleContext,
      title,
      description,
      scheduledAt,
      meetingType,
      status: 'scheduled'
    };

    const meeting = await Meeting.create(meetingData);

    // Generate Jitsi meeting link
    const jitsiDetails = generateCustomMeeting(meeting, req.user, true); // Creator is moderator
    
    // Update meeting with Jitsi details
    meeting.jitsiLink = jitsiDetails.meetingLink;
    meeting.roomName = jitsiDetails.roomName;
    await meeting.save();

    // Populate the meeting with participant details
    await meeting.populate('participants createdBy', 'name email role');

    res.status(201).json({
      status: 'success',
      message: 'Meeting created successfully',
      data: {
        meeting,
        jitsiDetails: {
          meetingLink: jitsiDetails.meetingLink,
          roomName: jitsiDetails.roomName,
          domain: jitsiDetails.domain
        }
      }
    });

  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get a specific meeting by ID
 * GET /api/meetings/:id
 */
exports.getMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id)
      .populate('participants createdBy', 'name email role');

    if (!meeting) {
      return res.status(404).json({
        status: 'error',
        message: 'Meeting not found'
      });
    }

    // Check if user is authorized to view this meeting
    const userParticipants = [
      meeting.createdBy._id.toString(),
      ...meeting.participants.map(p => p._id.toString())
    ];

    if (!userParticipants.includes(req.user._id.toString()) && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this meeting'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { meeting }
    });

  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get all meetings for a user
 * GET /api/meetings/user/:userId
 */
exports.getUserMeetings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    // Authorization check
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view these meetings'
      });
    }

    const query = {
      $or: [
        { createdBy: userId },
        { participants: userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const meetings = await Meeting.find(query)
      .populate('participants createdBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meeting.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        meetings,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });

  } catch (error) {
    console.error('Get user meetings error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Delete/Cancel a meeting
 * DELETE /api/meetings/:id
 */
exports.deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        status: 'error',
        message: 'Meeting not found'
      });
    }

    // Check if user is authorized to delete (creator or admin)
    if (meeting.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to delete this meeting'
      });
    }

    // Update status to cancelled instead of deleting
    meeting.status = 'cancelled';
    await meeting.save();

    res.status(200).json({
      status: 'success',
      message: 'Meeting cancelled successfully',
      data: { meeting }
    });

  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Update meeting status
 * PATCH /api/meetings/:id/status
 */
exports.updateMeetingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res.status(404).json({
        status: 'error',
        message: 'Meeting not found'
      });
    }

    // Check authorization
    const userParticipants = [
      meeting.createdBy.toString(),
      ...meeting.participants.map(p => p.toString())
    ];

    if (!userParticipants.includes(req.user._id.toString()) && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this meeting'
      });
    }

    const updates = { status };
    if (notes) updates.notes = notes;

    // Track start/end times
    if (status === 'active' && !meeting.startedAt) {
      updates.startedAt = new Date();
    } else if (status === 'completed' && !meeting.endedAt) {
      updates.endedAt = new Date();
      if (meeting.startedAt) {
        updates.duration = Math.round((new Date() - meeting.startedAt) / (1000 * 60)); // minutes
      }
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('participants createdBy', 'name email role');

    res.status(200).json({
      status: 'success',
      message: 'Meeting status updated successfully',
      data: { meeting: updatedMeeting }
    });

  } catch (error) {
    console.error('Update meeting status error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Helper function to check if user can create a meeting
 */
const canCreateMeeting = (user, participants, roleContext) => {
  const userRole = user.role;
  
  switch (roleContext) {
    case 'patient-doctor':
      return userRole === 'patient' || userRole === 'doctor' || userRole === 'admin';
    case 'doctor-hospital':
      return userRole === 'doctor' || userRole === 'hospital' || userRole === 'admin';
    case 'hospital-admin':
      return userRole === 'hospital' || userRole === 'admin';
    case 'doctor-doctor':
      return userRole === 'doctor' || userRole === 'admin';
    case 'custom':
      return true; // Anyone can create custom meetings
    default:
      return false;
  }
};

module.exports = {
  createMeeting,
  getMeeting,
  getUserMeetings,
  deleteMeeting,
  updateMeetingStatus
};