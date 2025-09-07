const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');
const User = require('../models/User');
const SlotLock = require('../models/SlotLock');
const { getAvailableSlots } = require('../services/hospitalAvailability');
const { sendAppointmentEmail } = require('../services/emailService');
const { generateAppointmentMeeting } = require('../services/jitsiService');
const Joi = require('joi');
const crypto = require('crypto');
const { createNotification } = require('../utils/notificationService'); // Import notification service
// Create new appointment with robust slot availability checking
exports.createAppointment = async (req, res) => {
  try {
    // Validate input
    const schema = Joi.object({
      hospital: Joi.string().required(),
      department: Joi.string().required(),
      doctor: Joi.string().optional(), // This is the Doctor profile ID from frontend
      appointmentType: Joi.string().valid('virtual', 'in-person').required(),
      appointmentDate: Joi.string().required(),
      appointmentTime: Joi.string().required(),
      reasonForVisit: Joi.string().required(),
      insurance: Joi.string().optional(), // Add this line
  insuranceInfo: Joi.object({ 
    provider: Joi.string().allow(''), 
    policyNumber: Joi.string().allow('') 
  }).optional(),
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

    const { hospital, department, appointmentDate, appointmentTime, doctor } = value;

    let doctorUserId = undefined;
    if (doctor) {
      const DoctorModel = require('../models/Doctor');
      const foundDoctor = await DoctorModel.findById(doctor).populate('user'); // Changed from .select('+user') to .populate('user')
      if (!foundDoctor) {
        return res.status(404).json({ status: 'error', message: 'Doctor not found.' });
      }
      doctorUserId = foundDoctor.user._id; // Get the User ID from the populated User object
      console.log("Backend: createAppointment - Resolved Doctor User ID:", doctorUserId);
    }

    // Normalize time to 24-hour format (HH:MM)
    const normalizeTime = (timeStr) => {
      if (!timeStr) return '';
      const [time, modifier] = timeStr.split(' ');
      if (!modifier) return time;
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const normalizedTime = normalizeTime(appointmentTime);
    const appointmentDateObj = new Date(appointmentDate);
    appointmentDateObj.setUTCHours(0,0,0,0);


    // Step 1: Clean up expired locks for this specific slot
    await SlotLock.deleteMany({
      hospital,
      department,
      appointmentDate: appointmentDateObj,
      appointmentTime: normalizedTime,
      expiresAt: { $lte: new Date() },
    });

console.log('🗂 Active SlotLocks for hospital/department:', 
  await SlotLock.find({ hospital, department, expiresAt: { $gt: new Date() } })
);


    // Step 2: Check if slot is already booked (existing appointments)
    const existingAppointment = await Appointment.findOne({
      hospital,
      department,
      appointmentDate: appointmentDateObj,
      appointmentTime: normalizedTime,
      status: { $in: ['pending', 'confirmed'] }, // Only check active appointments
      ...(doctor && { doctor }) // If doctor specified, check doctor-specific slot
    });

    if (existingAppointment) {
      return res.status(409).json({ 
        status: 'error', 
        message: 'This time slot is already booked. Please choose another time.' 
      });
    }

    // Step 3: Check if slot is currently locked by another user
    const existingLock = await SlotLock.findOne({
      hospital,
      department,
      appointmentDate: appointmentDateObj,
      appointmentTime: normalizedTime,
      expiresAt: { $gt: new Date() }, // Only active (non-expired) locks
    });

    if (existingLock) {
      return res.status(409).json({ 
        status: 'error', 
        message: 'This time slot is currently being booked by another user. Please choose another time or try again in a few minutes.' 
      });
    }

    // Step 4: Verify slot is in available slots list (from external API or working hours)
    console.log('🎯 Checking if slot is available for:', {
      hospital, 
      date: appointmentDate, 
      department,
      requestedTime: normalizedTime
    });
    
    let availableSlots = await getAvailableSlots({ 
      hospitalId: hospital, 
      date: appointmentDate, 
      department: department 
    });

    console.log('📊 Available slots received:', availableSlots);

    // Filter by doctor if specified
    if (doctor) {
      availableSlots = availableSlots.filter(slot => 
        !slot.doctorId || slot.doctorId === doctor
      );
      console.log('👨‍⚕️ Doctor-filtered slots:', availableSlots);
    }

    // Normalize available slots for comparison
    const normalizedAvailableSlots = availableSlots.map(slot => 
      normalizeTime(slot.time || slot)
    );

    console.log('🔄 Normalized available slots:', normalizedAvailableSlots);
    console.log('🔍 Looking for normalized time:', normalizedTime);
    console.log('❓ Is slot available?', normalizedAvailableSlots.includes(normalizedTime));

    if (!normalizedAvailableSlots.includes(normalizedTime)) {
      console.log('❌ Slot not found in available slots!');
      
      // Check if it's because the hospital is closed that day
      if (availableSlots.length === 0) {
        const dateObj = new Date(appointmentDate);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        return res.status(409).json({ 
          status: 'error', 
          message: `The hospital is closed on ${dayName}s. Please select a different date when the hospital is open.` 
        });
      }
      
      return res.status(409).json({ 
        status: 'error', 
        message: `The time slot ${appointmentTime} is not available. Available slots: ${availableSlots.join(', ') || 'None'}` 
      });
    }

    // Step 5: Attempt to acquire slot lock (with atomic operation to prevent race conditions)
    const lockId = crypto.randomUUID();
    const lockExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    
    let slotLock;
    try {
      slotLock = await SlotLock.create({
        hospital,
        department,
        appointmentDate: appointmentDateObj,
        appointmentTime: normalizedTime,
        lockId,
        expiresAt: lockExpires,
      });
    } catch (lockError) {
      // Handle duplicate key error (11000) - someone else just locked this slot
      if (lockError.code === 11000) {
        return res.status(409).json({ 
          status: 'error', 
          message: 'This time slot was just booked by another user. Please choose another time.' 
        });
      }
      throw lockError; // Re-throw other errors
    }

    // Step 6: Create appointment with lock protection
    const appointmentData = {
      ...value,
      patient: req.user._id,
      status: 'pending',
      paymentStatus: 'pending',
      slotLockId: lockId,
      doctor: doctorUserId || undefined, // Use the resolved Doctor User ID here
      department,
      consultationFee: value.consultationFee || (value.appointmentType === 'virtual' ? 25000 : 30000),
      appointmentTime: normalizedTime,
      appointmentDate: appointmentDateObj,
    };
    console.log("Backend: createAppointment - Doctor ID being set:", appointmentData.doctor);

console.log("📝 Final appointmentData:", appointmentData);
console.log("👤 Authenticated user:", req.user);

    let appointment;
    try {
      appointment = await Appointment.create(appointmentData);
      
      // Step 7: Create a new Meeting for virtual teleconsultations
      console.log("Backend: createAppointment - Checking if virtual appointment:", appointment.appointmentType);
      if (appointment.appointmentType === 'virtual') {
        const MeetingModel = require('../models/Meeting'); // Import Meeting model
        // crypto already imported at the top of the file

        const meeting_id = crypto.randomUUID();
        const meetingLink = `/meeting/${meeting_id}`;

        const meetingCreationData = {
          meeting_id: meeting_id,
          doctor: appointment.doctor,
          patient: appointment.patient,
          link: meetingLink,
          startTime: appointment.appointmentDate, // Use appointment date/time as meeting start/end
          endTime: new Date(new Date(appointment.appointmentDate).setMinutes(new Date(appointment.appointmentDate).getMinutes() + 30)), // Example: 30 min duration
          status: 'scheduled',
          title: `Virtual Consultation with Dr. ${(await User.findById(appointment.doctor)).name} and ${(await User.findById(appointment.patient)).name}`,
        };
        console.log("Backend: createAppointment - Meeting data to be created:", meetingCreationData);

        const newMeeting = await MeetingModel.create(meetingCreationData);
        console.log("Backend: createAppointment - New Meeting created successfully:", newMeeting);

        // Link the new Meeting to the Appointment
        console.log("Backend: createAppointment - Linking Meeting ID:", newMeeting._id, "to Appointment ID:", appointment._id);
        appointment.meeting = newMeeting._id;
        await appointment.save();
        console.log("Backend: createAppointment - Appointment saved with linked Meeting:", appointment);
      }

      await appointment.populate(['hospital', 'patient', ...(doctorUserId ? ['doctor'] : []), 'department', 'meeting']); // Populate meeting here
    } catch (appointmentError) {
      // If appointment creation fails, cleanup the lock
      await SlotLock.findByIdAndDelete(slotLock._id);
      console.error("Backend: createAppointment - Error during meeting creation/linking:", appointmentError);
      throw appointmentError;
    }

    // Step 8: Send confirmation email
    try { 
      await sendAppointmentEmail('confirmation', appointment, req.user); 
    } catch (emailError) { 
      console.error('Email send error:', emailError);
      // Don't fail the appointment creation for email errors
    }

    // Create notification for the patient
    await createNotification({
      recipient: appointment.patient._id,
      sender: req.user._id, // User who booked the appointment
      type: 'appointment',
      message: `Your appointment with ${appointment.hospital.name} for ${appointment.department.name} on ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been successfully booked.`,
      relatedEntity: { id: appointment._id, type: 'Appointment' },
    });

res.status(201).json({
  status: 'success',
  message: 'Appointment booked successfully.',
  data: {
    appointment: {
      _id: appointment._id,
      hospital: appointment.hospital,    // make sure populated
      patient: appointment.patient,      // make sure populated
      doctor: appointment.doctor || null,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      consultationFee: appointment.consultationFee,
      meeting: appointment.meeting || null, // Return the populated meeting object
      status: appointment.status,
    },
  },
});


  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error. Please try again later.' 
    });
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
    console.log("Backend: getAppointment - Authorization Check:");
    console.log("  User Role:", req.user.role);
    console.log("  User ID:", req.user._id.toString());
    console.log("  Appointment Patient ID:", appointment.patient._id.toString());
    console.log("  Appointment Doctor ID:", appointment.doctor ? appointment.doctor._id.toString() : "N/A");

    const canView = (
      appointment.patient._id.toString() === req.user._id.toString() ||
      (appointment.doctor && appointment.doctor._id.toString() === req.user._id.toString()) ||
      req.user.role === 'admin' ||
      req.user.role === 'hospital'
    );

    console.log("  Can View Result:", canView);
    
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
      .populate([
        { path: 'hospital' },
        { path: 'doctor', select: 'name specialization' }, // Populate doctor name and specialization
        { path: 'department', select: 'name' }, // Populate department name
        { path: 'meeting' } // Populate the meeting details
      ])
      .sort({ appointmentDate: -1 });
    
    console.log("Backend: getUserAppointments - Appointments after population:", JSON.stringify(appointments, null, 2));

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
  .populate([
    { path: 'patient', select: 'fullName email phoneNumber' },
    { path: 'doctor', select: 'fullName' },
    { path: 'hospital', select: 'name location' }
  ])
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

// Get all appointments (admin and hospital)
exports.getAllAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, hospital } = req.query;

console.log('🔍 GET ALL APPOINTMENTS - User:', req.user.role, req.user._id);
    console.log('🔍 Route path:', req.route.path);
    console.log('🔍 Received query for appointments:', { page, limit, status, hospital });

    const query = {};
    if (status) query.status = status;

    // Hospital role can only see their own appointments
    if (req.user.role === 'hospital') {
      const hospitalDoc = await Hospital.findOne({ userId: req.user._id });
      if (!hospitalDoc) {
        return res.status(403).json({
          status: 'error',
          message: 'Hospital profile not found'
        });
      }
      query.hospital = hospitalDoc._id;
      console.log('🏥 Hospital filter applied:', hospitalDoc._id);
    } else if (hospital && req.user.role === 'admin') {
      // Admin can filter by specific hospital
      query.hospital = hospital;
    }

    console.log('➡️ Constructed database query:', query);

    // Fetch appointments with population including patient fullName and doctor fullName
    const appointments = await Appointment.find(query)
      .populate([
        { path: 'patient', select: 'fullName email phoneNumber' },
        { path: 'doctor', select: 'fullName' },
        { path: 'hospital', select: 'name location' }
      ])
      .sort({ appointmentDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    console.log('✅ Successfully fetched appointments:', appointments.length);

    // Count total documents
    const total = await Appointment.countDocuments(query);
    console.log('✅ Successfully counted total appointments:', total);

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
    console.error('❌ Error in getAllAppointments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error. Please try again later.'
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
      // Create notification for the patient
      await createNotification({
        recipient: appointment.patient._id,
        sender: req.user._id, 
        type: 'appointment',
        message: `Your appointment with ${appointment.hospital.name} for ${appointment.department.name} on ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been ${appointment.status}.`,
        relatedEntity: { id: appointment._id, type: 'Appointment' },
      });
    } catch (error) {
      console.error('Email/Notification send error:', error);
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

    // Create notification for the patient
    await createNotification({
      recipient: appointment.patient._id,
      sender: req.user._id, 
      type: 'appointment',
      message: `Your appointment with ${appointment.hospital.name} for ${appointment.department.name} on ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been cancelled.`,
      relatedEntity: { id: appointment._id, type: 'Appointment' },
    });
    
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
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'departmentInfo'
        }
      },
      {
        $project: {
          departmentName: { $arrayElemAt: ['$departmentInfo.name', 0] },
          count: 1
        }
      },
      { $sort: { count: -1 } }
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

// @desc    Reassign appointment to different doctor
// @route   PATCH /api/appointments/:id/reassign
// @access  Private (Hospital or Admin)
exports.reassignAppointment = async (req, res) => {
  try {
    console.log('=== REASSIGN APPOINTMENT ===');
    console.log('Appointment ID:', req.params.id);
    console.log('New doctor ID:', req.body.doctorId);
    console.log('User:', req.user.role, req.user._id);

    const { doctorId, reason } = req.body;

    if (!doctorId) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor ID is required for reassignment'
      });
    }

    // Find the appointment
    const appointment = await Appointment.findById(req.params.id)
      .populate('hospital')
      .populate('patient', 'name email')
      .populate('doctor', 'specialization');

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found'
      });
    }

    // Check authorization - only hospital staff or admin can reassign
    let canReassign = false;
    if (req.user.role === 'admin') {
      canReassign = true;
    } else if (req.user.role === 'hospital') {
      const hospitalDoc = await Hospital.findOne({ userId: req.user._id });
      canReassign = hospitalDoc && appointment.hospital._id.toString() === hospitalDoc._id.toString();
    }

    if (!canReassign) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to reassign this appointment'
      });
    }

    // Verify new doctor exists and belongs to the same hospital/department
    const Doctor = require('../models/Doctor');
    const newDoctor = await Doctor.findById(doctorId)
      .populate('user', 'name email');

    if (!newDoctor) {
      return res.status(400).json({
        status: 'error',
        message: 'New doctor not found'
      });
    }

    if (newDoctor.hospital.toString() !== appointment.hospital._id.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'New doctor must belong to the same hospital'
      });
    }

    if (newDoctor.department.toString() !== appointment.department.toString()) {
      return res.status(400).json({
        status: 'error',
        message: 'New doctor must belong to the same department'
      });
    }

    // Store old doctor info for logging
    const oldDoctor = appointment.doctor;

    // Update appointment
    appointment.doctor = newDoctor.user._id; // Use the User ID from the populated Doctor object
    appointment.notes = appointment.notes + 
      `\n[${new Date().toISOString()}] Reassigned from Dr. ${oldDoctor?.specialization || 'Unassigned'} to Dr. ${newDoctor.specialization}` +
      (reason ? ` - Reason: ${reason}` : '');

    await appointment.save();
    await appointment.populate(['hospital', 'patient', 'doctor', 'department']);

    console.log('✅ Appointment reassigned successfully');

    // Send notification email (optional)
    try {
      const { sendAppointmentEmail } = require('../services/emailService');
      await sendAppointmentEmail('reassignment', appointment, appointment.patient);
      // Create notification for the patient and new doctor
      await createNotification({
        recipient: appointment.patient._id,
        sender: req.user._id,
        type: 'appointment',
        message: `Your appointment with ${appointment.hospital.name} for ${appointment.department.name} on ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime} has been reassigned to Dr. ${newDoctor.user.name}.`,
        relatedEntity: { id: appointment._id, type: 'Appointment' },
      });
      await createNotification({
        recipient: newDoctor.user._id,
        sender: req.user._id,
        type: 'appointment',
        message: `You have been assigned a new appointment with ${appointment.patient.name} at ${appointment.hospital.name} for ${appointment.department.name} on ${appointment.appointmentDate.toDateString()} at ${appointment.appointmentTime}.`,
        relatedEntity: { id: appointment._id, type: 'Appointment' },
      });
    } catch (emailError) {
      console.error('Failed to send reassignment email/notification:', emailError);
    }

    res.status(200).json({
      status: 'success',
      message: 'Appointment reassigned successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Error in reassignAppointment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reassign appointment'
    });
  }
};

// @desc    Get hospital dashboard statistics
// @route   GET /api/appointments/hospital-stats
// @access  Private (Hospital only)
exports.getHospitalStats = async (req, res) => {
  try {
    console.log('=== GET HOSPITAL STATS ===');
    console.log('Request User (getHospitalStats):', req.user); // Added for debugging

    if (req.user.role !== 'hospital') {
      return res.status(403).json({
        status: 'error',
        message: 'Hospital access required'
      });
    }

    // Get hospital
    const hospitalDoc = await Hospital.findOne({ userId: req.user._id });
    console.log('Found Hospital by userId (getHospitalStats):', hospitalDoc ? hospitalDoc.name : 'Not Found'); // Added for debugging
    if (!hospitalDoc) {
      return res.status(404).json({
        status: 'error',
        message: 'Hospital profile not found'
      });
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // Calculate 12 months ago from today
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Get appointments stats for this hospital
    const appointmentStats = await Appointment.aggregate([
      { $match: { hospital: hospitalDoc._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get monthly appointments count over the last 12 months
    const appointmentsPerMonth = await Appointment.aggregate([
      { $match: {
        hospital: hospitalDoc._id,
        appointmentDate: { $gte: oneYearAgo }
      }},
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get today's appointments
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAppointments = await Appointment.countDocuments({
      hospital: hospitalDoc._id,
      appointmentDate: { $gte: todayStart, $lte: todayEnd }
    });

    // Get department-wise stats
    const departmentStats = await Appointment.aggregate([
      { $match: { hospital: hospitalDoc._id } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'departmentInfo'
        }
      },
      {
        $project: {
          departmentName: { $arrayElemAt: ['$departmentInfo.name', 0] },
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get patient count (patients who have visited this hospital)
    const Patient = require('../models/Patient');
    const patientCount = await Patient.countDocuments({
      'visitedHospitals.hospital': hospitalDoc._id,
      isActive: true
    });

    // Get doctor count
    const Doctor = require('../models/Doctor');
    const doctorCount = await Doctor.countDocuments({
      hospital: hospitalDoc._id,
      isActive: true
    });

    // Debugging aggregated data
    console.log('Debug getHospitalStats - hospitalDoc._id:', hospitalDoc._id);
    console.log('Debug getHospitalStats - appointmentStats:', appointmentStats);
    console.log('Debug getHospitalStats - appointmentsPerMonth:', appointmentsPerMonth);
    console.log('Debug getHospitalStats - todayAppointments:', todayAppointments);
    console.log('Debug getHospitalStats - departmentStats:', departmentStats);
    console.log('Debug getHospitalStats - patientCount:', patientCount);
    console.log('Debug getHospitalStats - doctorCount:', doctorCount);

    res.status(200).json({
      status: 'success',
      message: 'Hospital statistics retrieved successfully',
      data: {
        hospital: {
          name: hospitalDoc.name,
          location: hospitalDoc.location
        },
        appointments: {
          total: appointmentStats.reduce((sum, stat) => sum + stat.count, 0),
          byStatus: appointmentStats,
          monthly: appointmentsPerMonth, // Add monthly appointments data
          today: todayAppointments
        },
        departments: departmentStats,
        patients: patientCount,
        doctors: doctorCount
      }
    });
  } catch (error) {
    console.error('Error in getHospitalStats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve hospital statistics'
    });
  }
};

// @desc    Get appointments for the logged-in doctor
// @route   GET /api/appointments/my-doctor-appointments
// @access  Private (Doctor only)
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    console.log("Backend: getDoctorAppointments - User:", req.user);

    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Only doctors can view this page.'
      });
    }

    const query = { doctor: req.user._id };
    if (status) query.status = status;
    console.log("Backend: getDoctorAppointments - Constructed Query:", query);

    const appointments = await Appointment.find(query)
      .populate([
        { path: 'patient', select: 'name email phoneNumber' },
        { path: 'doctor', select: 'name specialization' },
        { path: 'hospital', select: 'name location' },
        { path: 'department', select: 'name' },
        { path: 'meeting' } // Populate the meeting details
      ])
      // .select('+meetingLink +roomName') // Explicitly select meetingLink and roomName - REMOVED
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    console.log("Backend: getDoctorAppointments - Raw Appointments from DB before mapping:", JSON.stringify(appointments, null, 2));

    console.log("Backend: getDoctorAppointments - Appointments Found:", appointments.map(app => ({
      _id: app._id,
      patientName: app.patient.name,
      status: app.status,
      appointmentType: app.appointmentType,
      meeting: app.meeting || null, // Return the populated meeting object
    })));

    const total = await Appointment.countDocuments(query);
    console.log("Backend: getDoctorAppointments - Total Appointments:", total);

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
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve doctor appointments'
    });
  }
};