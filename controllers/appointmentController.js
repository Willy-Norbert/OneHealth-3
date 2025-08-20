const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'byiringirourban20@gmail.com',
    pass: 'zljw hslg rxpb mqpu'
  }
});

// Send appointment confirmation email
const sendAppointmentConfirmation = async (appointment, patient) => {
  const mailOptions = {
    from: 'byiringirourban20@gmail.com',
    to: patient.email,
    subject: 'Appointment Confirmation - ONE HEALTHLINE CONNECT',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #10B981; color: white; padding: 20px; text-align: center;">
          <h1>Appointment Confirmed!</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2>Dear ${appointment.patientDetails.fullName},</h2>
          <p>Your appointment has been successfully booked. Here are the details:</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #10B981; margin-top: 0;">Appointment Details</h3>
            <p><strong>Appointment ID:</strong> ${appointment._id}</p>
            <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p><strong>Type:</strong> ${appointment.appointmentType === 'virtual' ? 'Virtual Consultation' : 'In-Person Visit'}</p>
            <p><strong>Department:</strong> ${appointment.department}</p>
            <p><strong>Reason:</strong> ${appointment.reasonForVisit}</p>
            ${appointment.appointmentType === 'virtual' && appointment.meetingLink ? 
              `<p><strong>Meeting Link:</strong> <a href="${appointment.meetingLink}">${appointment.meetingLink}</a></p>` : ''
            }
          </div>
          
          <div style="background-color: #EEF2FF; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3B82F6; margin-top: 0;">Important Notes</h3>
            <ul>
              <li>Please arrive 15 minutes early for in-person appointments</li>
              <li>Bring a valid ID and insurance card if applicable</li>
              <li>You will receive a reminder 24 hours before your appointment</li>
              ${appointment.appointmentType === 'virtual' ? 
                '<li>Ensure you have a stable internet connection for virtual consultations</li>' : ''
              }
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p>Need to reschedule or cancel? Contact us at:</p>
            <p><strong>Phone:</strong> +250 788 123 456</p>
            <p><strong>Email:</strong> support@onehealthlineconnect.rw</p>
          </div>
          
          <div style="background-color: #10B981; color: white; padding: 15px; text-align: center; border-radius: 8px;">
            <p style="margin: 0;">Thank you for choosing ONE HEALTHLINE CONNECT!</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

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
    await sendAppointmentConfirmation(appointment, req.user);
    
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