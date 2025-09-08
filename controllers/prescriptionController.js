const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Joi = require('joi');
const { createNotification } = require('../utils/notificationService');
const { sendPrescriptionEmail } = require('../services/emailService'); // Import email service
const PDFDocument = require('pdfkit');

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
exports.createPrescription = async (req, res) => {
  try {
    // Validate input
    const schema = Joi.object({
      patient: Joi.string().required(),
      appointment: Joi.string().required(),
      diagnosis: Joi.string().required(),
      medications: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        dosage: Joi.string().required(),
        frequency: Joi.string().required(),
        instructions: Joi.string().allow(''),
      })).min(1).required(),
      notes: Joi.string().allow(''),
    });

    console.log("Backend: createPrescription - Incoming Request Body:", req.body);

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'error', message: error.details[0].message });

    console.log("Backend: createPrescription - Validated Data:", value);

    const { patient, appointment, diagnosis, medications, notes } = value;

    // Ensure only doctors can create prescriptions
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Only doctors can create prescriptions.'
      });
    }

    // Verify the appointment exists and is assigned to this doctor and patient
    // Some datasets store doctor as the Doctor profile, others as the User ID. Support both.
    const doctorProfile = await Doctor.findOne({ user: req.user._id }).select('_id');
    const existingAppointment = await Appointment.findOne({
      _id: appointment,
      patient: patient,
      $or: [
        { doctor: req.user._id },
        ...(doctorProfile ? [{ doctor: doctorProfile._id }] : []),
      ],
    });

    console.log("Backend: createPrescription - Existing Appointment Check:", existingAppointment);

    if (!existingAppointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found or not assigned to this doctor/patient.'
      });
    }

    // Create prescription
    const newPrescription = await Prescription.create({
      patient,
      doctor: req.user._id,
      appointment,
      diagnosis,
      medications,
      notes,
    });

    console.log("Backend: createPrescription - New Prescription Created (before populate):");
    console.log(newPrescription);

    await newPrescription.populate([
      { path: 'patient', select: 'name email' },
      { path: 'doctor', select: 'name specialization' },
      { path: 'appointment', select: 'appointmentDate appointmentTime' }
    ]);

    // Create notification for the patient
    await createNotification({
      recipient: patient,
      sender: req.user._id,
      type: 'prescription',
      message: `Dr. ${newPrescription.doctor.name} has issued a new prescription for your appointment on ${newPrescription.appointment.appointmentDate.toDateString()}.`,
      relatedEntity: { id: newPrescription._id, type: 'Prescription' },
    });

    // Send prescription email to patient
    try {
      await sendPrescriptionEmail(newPrescription, newPrescription.patient, req.user);
    } catch (emailError) {
      console.error('Error sending prescription email:', emailError);
      // Do not block the user if email fails
    }

    res.status(201).json({
      status: 'success',
      message: 'Prescription created successfully.',
      data: { prescription: newPrescription },
    });
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error. Please try again later.' 
    });
  }
};

// @desc    Get all prescriptions for a specific patient
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private (Patient, Doctor, Hospital, Admin)
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Authorization check
    // Patient can view their own prescriptions
    // Doctor can view prescriptions for patients they are assigned to (via appointments)
    // Hospital staff can view prescriptions for patients in their hospital
    // Admin can view any prescription
    let canView = false;
    if (req.user._id.toString() === patientId || req.user.role === 'admin') {
      canView = true;
    } else if (req.user.role === 'doctor') {
      // Check if this doctor has any appointments with this patient
      const hasAppointment = await Appointment.findOne({
        doctor: req.user._id,
        patient: patientId,
      });
      if (hasAppointment) canView = true;
    } else if (req.user.role === 'hospital') {
      // Check if this patient has appointments in the hospital the user is linked to
      const hospitalDoc = await User.findById(req.user._id).select('hospital');
      if (hospitalDoc && hospitalDoc.hospital) {
        const hasAppointmentInHospital = await Appointment.findOne({
          hospital: hospitalDoc.hospital,
          patient: patientId,
        });
        if (hasAppointmentInHospital) canView = true;
      }
    }

    if (!canView) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Not authorized to view these prescriptions.'
      });
    }

    const query = { patient: patientId };

    const prescriptions = await Prescription.find(query)
      .populate([
        { path: 'patient', select: 'name email' },
        { path: 'doctor', select: 'name specialization' },
        { path: 'appointment', select: 'appointmentDate appointmentTime' }
      ])
      .sort({ datePrescribed: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        prescriptions,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching patient prescriptions:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error. Please try again later.' 
    });
  }
};

// @desc    Get all prescriptions authored by the logged-in doctor
// @route   GET /api/prescriptions/doctor-authored
// @access  Private (Doctor only)
exports.getDoctorAuthoredPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Only doctors can view their authored prescriptions.'
      });
    }

    const query = { doctor: req.user._id };

    const prescriptions = await Prescription.find(query)
      .populate([
        { path: 'patient', select: 'name email' },
        { path: 'doctor', select: 'name specialization' },
        { path: 'appointment', select: 'appointmentDate appointmentTime' }
      ])
      .sort({ datePrescribed: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        prescriptions,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching doctor authored prescriptions:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error. Please try again later.' 
    });
  }
};

// @desc    Get current user's prescriptions
// @route   GET /api/prescriptions/my
// @access  Private (Patient)
exports.getMyPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = { patient: req.user._id };

    const prescriptions = await Prescription.find(query)
      .populate([
        { path: 'patient', select: 'name email' },
        { path: 'doctor', select: 'name specialization' },
        { path: 'appointment', select: 'appointmentDate appointmentTime' }
      ])
      .sort({ datePrescribed: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        prescriptions,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching user prescriptions:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error. Please try again later.' 
    });
  }
};

// @desc    Generate PDF for a prescription
// @route   GET /api/prescriptions/:id/pdf
// @access  Private (Patient owner, Doctor author, Admin)
exports.getPrescriptionPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const rx = await Prescription.findById(id)
      .populate([{ path: 'patient', select: 'name email' }, { path: 'doctor', select: 'name specialization' }, { path: 'appointment', select: 'appointmentDate appointmentTime' }]);
    if (!rx) return res.status(404).json({ status: 'error', message: 'Prescription not found' });

    // Authorization
    const isOwner = rx.patient._id.toString() === req.user._id.toString();
    const isAuthor = rx.doctor._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAuthor && !isAdmin) {
      return res.status(403).json({ status: 'error', message: 'Not authorized' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=prescription-${rx._id}.pdf`);
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text('Prescription', { align: 'center' }).moveDown(1);
    doc.fontSize(12).text(`Patient: ${rx.patient.name}`);
    doc.text(`Doctor: ${rx.doctor.name} (${rx.doctor.specialization || 'Doctor'})`);
    doc.text(`Date: ${rx.appointment?.appointmentDate ? new Date(rx.appointment.appointmentDate).toLocaleDateString() : new Date().toLocaleDateString()}`);
    doc.moveDown(1);
    doc.fontSize(14).text('Diagnosis');
    doc.fontSize(12).text(rx.diagnosis || '-', { paragraphGap: 8 });
    doc.fontSize(14).text('Medications');
    doc.moveDown(0.5);
    rx.medications.forEach((m, idx) => {
      doc.fontSize(12).text(`${idx + 1}. ${m.name} — ${m.dosage} (${m.frequency})${m.instructions ? ' — ' + m.instructions : ''}`);
    });
    if (rx.notes) {
      doc.moveDown(1);
      doc.fontSize(14).text('Notes');
      doc.fontSize(12).text(rx.notes);
    }
    doc.end();
  } catch (error) {
    console.error('Error generating prescription PDF:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
