const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const SlotLock = require('../models/SlotLock');
const { getAvailableSlots } = require('../services/hospitalAvailability');
const { sendAppointmentEmail } = require('../services/emailService');
const { generateAppointmentMeeting } = require('../services/jitsiService');
const Joi = require('joi');
const crypto = require('crypto');
// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const schema = Joi.object({
      hospital: Joi.string().required(),
      department: Joi.string().required(),
      appointmentType: Joi.string().valid('virtual', 'in-person').required(),
      appointmentDate: Joi.string().required(), // YYYY-MM-DD
      appointmentTime: Joi.string().required(), // e.g., 09:30 AM
      reasonForVisit: Joi.string().required(),
      patientDetails: Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        age: Joi.number().required(),
        gender: Joi.string().valid('Male', 'Female').required(),
        address: Joi.string().allow(''),
        emergencyContact: Joi.object({
          name: Joi.string().allow(''),
          phone: Joi.string().allow(''),
          relationship: Joi.string().allow(''),
        }).unknown(true),
      }).required(),
      consultationFee: Joi.number().optional(),
      insuranceInfo: Joi.object({ provider: Joi.string().allow(''), policyNumber: Joi.string().allow('') }).optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const { hospital, department, appointmentDate, appointmentTime } = value;

    // Validate against availability service
    const available = await getAvailableSlots({ hospitalId: hospital, date: appointmentDate, department });
    if (!available.includes(appointmentTime)) {
      return res.status(409).json({ status: 'error', message: 'Requested slot is not available' });
    }

    // Acquire slot lock (prevents race conditions)
    const lockId = crypto.randomUUID();
    const lockExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes hold
    try {
      await SlotLock.create({
        hospital,
        department,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        lockId,
        expiresAt: lockExpires,
      });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(409).json({ status: 'error', message: 'Slot just got booked/locked. Please choose another.' });
      }
      throw e;
    }

    const appointmentData = {
      ...value,
      patient: req.user._id,
      status: 'pending',
      paymentStatus: 'pending',
      slotLockId: lockId,
      // consultationFee defaulting
      consultationFee: value.consultationFee || (value.appointmentType === 'virtual' ? 25000 : 30000),
    };

    const appointment = await Appointment.create(appointmentData);
    await appointment.populate(['hospital', 'patient']);

    // Generate Jitsi meeting link for virtual appointments
    if (appointment.appointmentType === 'virtual') {
      try {
        const jitsiDetails = generateAppointmentMeeting(appointment, req.user, false);
        appointment.meetingLink = jitsiDetails.meetingLink;
        appointment.roomName = jitsiDetails.roomName;
        await appointment.save();
      } catch (jitsiError) {
        console.error('Jitsi link generation error:', jitsiError);
        // Continue without failing the appointment creation
      }
    }

    // Send confirmation email (best-effort)
    try { await sendAppointmentEmail('confirmation', appointment, req.user); } catch (err) { console.error('Email send error:', err); }

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked. Proceed to payment to confirm.',
      data: { appointment },
    });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

// Get single appointment by ID
exports.getAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id)
      .populate(['hospital', 'patient', 'doctor']);
    
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }
    
    // Check authorization - only patient, doctor, hospital staff, or admin can view
    const canView = (
      appointment.patient._id.toString() === req.user._id.toString() ||
      (appointment.doctor && appointment.doctor._id.toString() === req.user._id.toString()) ||
      req.user.role === 'admin' ||
      req.user.role === 'hospital'
    );
    
    if (!canView) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this appointment'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { appointment }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get user appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('hospital')
      .sort({ appointmentDate: -1 });
    
    res.status(200).json({
      status: 'success',
      data: { appointments }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get appointments for specific user (by userId)
exports.getAppointmentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    
    // Authorization check
    if (req.user._id.toString() !== userId && req.user.role !== 'admin' && req.user.role !== 'hospital') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view these appointments'
      });
    }
    
    const query = { patient: userId };
    if (status) query.status = status;
    
    const appointments = await Appointment.find(query)
      .populate(['hospital', 'patient', 'doctor'])
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Appointment.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: {
        appointments,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get all appointments (admin)
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, hospital } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (hospital) query.hospital = hospital;
    
    const appointments = await Appointment.find(query)
      .populate(['patient', 'hospital'])
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Appointment.countDocuments(query);
    
    res.status(200).json({
      status: 'success',
      data: { 
        appointments,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate(['patient', 'hospital']);
    
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Send status update email
    try {
      await sendAppointmentEmail('update', appointment, appointment.patient);
    } catch (error) {
      console.error('Email send error:', error);
    }
    
    res.status(200).json({
      status: 'success',
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }
    
    // Check if user owns the appointment or is admin
    if (appointment.patient.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to cancel this appointment'
      });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Appointment cancelled successfully',
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// Get available time slots (uses external API with fallback)
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const querySchema = Joi.object({
      date: Joi.string().required(),
      hospital: Joi.string().required(),
      department: Joi.string().required(),
    });
    const { error, value } = querySchema.validate(req.query);
    if (error) return res.status(400).json({ status: 'error', message: error.message });

    const { date, hospital, department } = value;
    const availableSlots = await getAvailableSlots({ hospitalId: hospital, date, department });

    return res.status(200).json({ status: 'success', data: { availableSlots } });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};


// Get appointment statistics (admin)
exports.getAppointmentStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const stats = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const monthlyStats = await Appointment.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const departmentStats = await Appointment.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.status(200).json({
      status: 'success',
      data: {
        overallStats: stats,
        monthlyStats,
        departmentStats
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};