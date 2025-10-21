const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Appointment = require('../models/Appointment'); // Import Appointment model
const { sendEmail, baseTemplate } = require('../services/emailService');
const Joi = require('joi');
const crypto = require('crypto'); // For generating UUIDs
const { createNotification } = require('../utils/notificationService');

/**
 * Create a new custom meeting
 * POST /api/meetings
 */
exports.createMeeting = async (req, res) => {
  try {
    const schema = Joi.object({
      patient: Joi.string().required(),
      doctor: Joi.string().required(),
      appointment: Joi.string().optional(), // Optional, but usually linked
      startTime: Joi.date().required(),
      endTime: Joi.date().required(),
      title: Joi.string().allow(''), // Optional title
      description: Joi.string().allow(''), // Optional description
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }

    const { patient, doctor, appointment, startTime, endTime, title, description } = value;

    // Ensure only authorized users (doctor, admin) can create meetings for others
    if (req.user.role === 'patient' && (req.user._id.toString() !== patient || req.user._id.toString() === doctor)) {
      return res.status(403).json({
        status: 'error',
        message: 'Patients can only create meetings for themselves and their assigned doctor.',
      });
    }

    // Verify doctor and patient exist
    const existingDoctor = await User.findById(doctor);
    const existingPatient = await User.findById(patient);

    if (!existingDoctor || existingDoctor.role !== 'doctor') {
      return res.status(400).json({ status: 'error', message: 'Invalid doctor ID' });
    }
    if (!existingPatient || existingPatient.role !== 'patient') {
      return res.status(400).json({ status: 'error', message: 'Invalid patient ID' });
    }

    // If an appointment is provided, verify it exists and is for this doctor/patient
    if (appointment) {
      const associatedAppointment = await Appointment.findById(appointment);
      if (!associatedAppointment ||
          associatedAppointment.doctor.toString() !== doctor ||
          associatedAppointment.patient.toString() !== patient) {
        return res.status(400).json({ status: 'error', message: 'Associated appointment is invalid or does not match doctor/patient.' });
      }
    }

    // Generate unique meeting_id and link
    const meeting_id = crypto.randomUUID();
    const link = `/meeting/${meeting_id}`;

    const newMeeting = await Meeting.create({
      meeting_id,
      doctor,
      patient,
      link,
      startTime,
      endTime,
      title: title || `Consultation with Dr. ${existingDoctor.name} and ${existingPatient.name}`,
      description,
      status: 'scheduled',
    });

    // Update the associated appointment with the new meeting reference
    if (appointment) {
      await Appointment.findByIdAndUpdate(appointment, { meeting: newMeeting._id });
    }

    await newMeeting.populate(['doctor', 'patient']);

    // TTL (auto-expire metadata only)
    const ttlMinutes = parseInt(process.env.MEETING_TTL_MINUTES || '120', 10);
    const expiresAt = new Date(new Date(startTime).getTime() + ttlMinutes * 60000);

    // Send meeting invitation emails to patient and doctor (and hospital if available)
    try {
      const hostUrl = process.env.FRONTEND_URL || ' http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io'
      const meetingUrl = `${hostUrl}/meeting/${meeting_id}`
      const subject = 'Teleconsultation Meeting Invitation'
      const htmlBody = `
        <p>You have been invited to a teleconsultation meeting.</p>
        <ul>
          <li><strong>Starts:</strong> ${new Date(startTime).toLocaleString()}</li>
          <li><strong>Ends:</strong> ${new Date(endTime).toLocaleString()}</li>
          <li><strong>Title:</strong> ${title || 'Teleconsultation'}</li>
        </ul>
        <p><a href="${meetingUrl}" style="color:#0ea5e9;">Join Meeting</a></p>
      `
      if (newMeeting?.patient?.email) await sendEmail({ to: newMeeting.patient.email, subject, html: baseTemplate('Meeting Invitation', htmlBody) })
      if (newMeeting?.doctor?.email) await sendEmail({ to: newMeeting.doctor.email, subject, html: baseTemplate('Meeting Invitation', htmlBody) })
      // Optionally notify hospital if doctor is linked to one
      try {
        const docUser = await User.findById(doctor).populate('hospital')
        const hospitalId = docUser?.hospital
        if (hospitalId) {
          const Hospital = require('../models/Hospital')
          const hospital = await Hospital.findById(hospitalId)
          const hospitalEmail = hospital?.contact?.email
          if (hospitalEmail) await sendEmail({ to: hospitalEmail, subject, html: baseTemplate('Meeting Invitation', htmlBody) })
        }
      } catch {}
    } catch (e) {
      console.warn('Failed to send meeting invitation emails:', e.message)
    }

    res.status(201).json({
      status: 'success',
      message: 'Meeting created successfully',
      data: { meeting: newMeeting },
    });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error. Please try again later.',
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

    const meeting = await Meeting.findOne({ meeting_id: id })
      .populate(['doctor', 'patient']);

    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    }

    // Check if user is authorized to view this meeting
    const isAuthorized = (
      req.user._id.toString() === meeting.doctor._id.toString() ||
      req.user._id.toString() === meeting.patient._id.toString() ||
      req.user.role === 'admin'
    );

    if (!isAuthorized) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to view this meeting' });
    }

    res.status(200).json({ status: 'success', data: { meeting } });
  } catch (error) {
    console.error('Get meeting error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Get all meetings for a user (either as doctor or patient)
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
        message: 'Not authorized to view these meetings',
      });
    }

    const query = {
      $or: [
        { doctor: userId },
        { patient: userId },
      ],
    };
    if (status) {
      query.status = status;
    }

    const meetings = await Meeting.find(query)
      .populate(['doctor', 'patient'])
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Meeting.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        meetings,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      },
    });
  } catch (error) {
    console.error('Get user meetings error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Delete/Cancel a meeting
 * DELETE /api/meetings/:id
 */
exports.deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findOne({ meeting_id: id }); // Find by meeting_id

    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    }

    // Check if user is authorized to delete (doctor, patient or admin)
    const isAuthorized = (
      req.user._id.toString() === meeting.doctor.toString() ||
      req.user._id.toString() === meeting.patient.toString() ||
      req.user.role === 'admin'
    );

    if (!isAuthorized) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to delete this meeting' });
    }

    // Update status to cancelled instead of deleting
    meeting.status = 'cancelled';
    await meeting.save();

    // Optionally, also update the associated appointment if it exists
    const associatedAppointment = await Appointment.findOne({ meeting: meeting._id });
    if (associatedAppointment) {
      associatedAppointment.meeting = undefined; // Remove reference
      await associatedAppointment.save();
    }

    res.status(200).json({ status: 'success', message: 'Meeting cancelled successfully', data: { meeting } });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({ status: 'error', message: error.message });
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

    const meeting = await Meeting.findOne({ meeting_id: id }); // Find by meeting_id

    if (!meeting) {
      return res.status(404).json({ status: 'error', message: 'Meeting not found' });
    }

    // Check authorization
    const isAuthorized = (
      req.user._id.toString() === meeting.doctor.toString() ||
      req.user._id.toString() === meeting.patient.toString() ||
      req.user.role === 'admin'
    );

    if (!isAuthorized) {
      return res.status(403).json({ status: 'error', message: 'Not authorized to update this meeting' });
    }

    // Payment gating: doctors cannot start meeting unless appointment paid/confirmed
    if (status === 'in-progress' && req.user.role === 'doctor') {
      try {
        const appointment = await Appointment.findOne({ meeting: meeting._id });
        if (appointment && appointment.paymentStatus !== 'paid') {
          return res.status(403).json({ status: 'error', message: 'Payment pending — hospital confirmation required.' });
        }
      } catch (e) {
        // if lookup fails, block conservatively
        return res.status(403).json({ status: 'error', message: 'Payment verification failed. Please try again or contact hospital.' });
      }
    }

    const updates = { status };
    if (notes !== undefined) updates.notes = notes;

    // Track start/end times
    if (status === 'in-progress' && !meeting.startTime) {
      updates.startTime = new Date();
    } else if (status === 'completed' && !meeting.endTime) {
      updates.endTime = new Date();
      if (meeting.startTime) {
        // Calculate duration if both start and end times are available
        // The Meeting schema doesn't have a duration field, so we'll just log it or add it later if needed
        console.log(`Meeting duration: ${(new Date().getTime() - meeting.startTime.getTime()) / (1000 * 60)} minutes`);
      }
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meeting._id, // Use MongoDB _id for update
      updates,
      { new: true, runValidators: true }
    ).populate(['doctor', 'patient']);

    res.status(200).json({ status: 'success', message: 'Meeting status updated successfully', data: { meeting: updatedMeeting } });
  } catch (error) {
    console.error('Update meeting status error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};

/**
 * Reschedule meeting time and details
 * PATCH /api/meetings/:id
 */
exports.rescheduleMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const schema = Joi.object({
      startTime: Joi.date().required(),
      endTime: Joi.date().required(),
      title: Joi.string().allow(''),
      description: Joi.string().allow(''),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

    const meeting = await Meeting.findOne({ meeting_id: id }).populate(['doctor','patient']);
    if (!meeting) return res.status(404).json({ status: 'error', message: 'Meeting not found' });

    const isAuthorized = (
      req.user._id.toString() === String(meeting.doctor?._id || meeting.doctor) ||
      req.user._id.toString() === String(meeting.patient?._id || meeting.patient) ||
      req.user.role === 'admin'
    );
    if (!isAuthorized) return res.status(403).json({ status: 'error', message: 'Not authorized to reschedule this meeting' });

    meeting.startTime = new Date(value.startTime);
    meeting.endTime = new Date(value.endTime);
    if (value.title !== undefined) meeting.title = value.title;
    if (value.description !== undefined) meeting.description = value.description;
    meeting.status = 'scheduled';
    await meeting.save();

    // Emails
    try {
      const hostUrl = process.env.FRONTEND_URL || 'http://jk4k84k0so8g4ggg4oow4kcs.69.62.122.202.sslip.io';
      const meetingUrl = `${hostUrl}/meeting/${meeting.meeting_id}`;
      const subject = 'Teleconsultation Meeting Rescheduled';
      const htmlBody = `
        <p>Your teleconsultation has been rescheduled.</p>
        <ul>
          <li><strong>Starts:</strong> ${new Date(meeting.startTime).toLocaleString()}</li>
          <li><strong>Ends:</strong> ${new Date(meeting.endTime).toLocaleString()}</li>
          <li><strong>Title:</strong> ${meeting.title || 'Teleconsultation'}</li>
        </ul>
        <p><a href="${meetingUrl}" style="color:#0ea5e9;">Join Meeting</a></p>
      `;
      if (meeting?.patient?.email) await sendEmail({ to: meeting.patient.email, subject, html: baseTemplate('Meeting Rescheduled', htmlBody) });
      if (meeting?.doctor?.email) await sendEmail({ to: meeting.doctor.email, subject, html: baseTemplate('Meeting Rescheduled', htmlBody) });
    } catch {}

    // Notifications
    try {
      await createNotification({
        recipient: String(meeting.patient?._id || meeting.patient),
        sender: req.user._id,
        type: 'appointment',
        message: `Your meeting '${meeting.title || 'Teleconsultation'}' was rescheduled to ${new Date(meeting.startTime).toLocaleString()}.`,
        relatedEntity: { id: meeting._id, type: 'Appointment' },
      });
      await createNotification({
        recipient: String(meeting.doctor?._id || meeting.doctor),
        sender: req.user._id,
        type: 'appointment',
        message: `Meeting '${meeting.title || 'Teleconsultation'}' with patient was rescheduled to ${new Date(meeting.startTime).toLocaleString()}.`,
        relatedEntity: { id: meeting._id, type: 'Appointment' },
      });
    } catch {}

    res.status(200).json({ status: 'success', message: 'Meeting rescheduled', data: { meeting } });
  } catch (error) {
    console.error('Reschedule meeting error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
