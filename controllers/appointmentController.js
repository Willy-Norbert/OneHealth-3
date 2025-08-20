const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const { sendAppointmentEmail } = require('../services/emailService');

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      patient: req.user._id
    };

    // Set consultation fee based on appointment type and department
    if (!appointmentData.consultationFee) {
      appointmentData.consultationFee = appointmentData.appointmentType === 'virtual' ? 25000 : 30000;
    }

    const appointment = await Appointment.create(appointmentData);
    
    // Populate references
    await appointment.populate(['hospital', 'patient']);
    
    // Send confirmation email
    try {
      await sendAppointmentEmail('confirmation', appointment, req.user);
    } catch (error) {
      console.error('Email send error:', error);
    }
    
    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully! Confirmation email sent.',
      data: { appointment }
    });
  } catch (error) {
    res.status(400).json({
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

// Get available time slots
exports.getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, hospital, department } = req.query;
    
    const allTimeSlots = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
      "04:00 PM", "04:30 PM"
    ];
    
    // Find booked appointments for the given date
    const bookedAppointments = await Appointment.find({
      appointmentDate: new Date(date),
      hospital,
      department,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    const bookedTimes = bookedAppointments.map(apt => apt.appointmentTime);
    const availableSlots = allTimeSlots.filter(slot => !bookedTimes.includes(slot));
    
    res.status(200).json({
      status: 'success',
      data: { availableSlots }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
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