const MedicalRecord = require('../models/MedicalRecord');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment'); // Import Appointment model

// @desc    Get medical records with filtering
// @route   GET /api/medical-records
// @access  Private (Doctor/Admin)
exports.getAllMedicalRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { patient, doctor, hospital, visitType } = req.query;
    
    let filter = {};
    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (hospital) filter.hospital = hospital;
    if (visitType) filter.visitType = visitType;

    // If user is a doctor, only show records they created
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (doctorProfile) {
        filter.doctor = doctorProfile._id;
      }
    }

    const records = await MedicalRecord.find(filter)
      .populate('patient', 'fullName email phoneNumber')
      .populate('doctor', 'specialization licenseNumber')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'fullName' }
      })
      .populate('hospital', 'name location')
      .populate('prescriptions')
      .skip(skip)
      .limit(limit)
      .sort({ visitDate: -1 });

    const total = await MedicalRecord.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Medical records retrieved successfully',
      data: { 
        records, 
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving medical records',
      data: { error: error.message }
    });
  }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private (Patient/Doctor/Admin)
exports.getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'fullName email phoneNumber')
      .populate('doctor', 'specialization licenseNumber')
      .populate({
        path: 'doctor',
        populate: { path: 'user hospital', select: 'fullName name location' }
      })
      .populate('hospital', 'name location contact')
      .populate('appointment')
      .populate('consultation')
      .populate('prescriptions')
      .populate('followUp.specialist', 'specialization')
      .populate({
        path: 'followUp.specialist',
        populate: { path: 'user', select: 'fullName' }
      });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
        data: null
      });
    }

    // Check permissions
    const isPatient = req.user._id.toString() === record.patient._id.toString();
    const isDoctor = await Doctor.findOne({ 
      user: req.user._id, 
      _id: record.doctor._id 
    });
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this medical record',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medical record retrieved successfully',
      data: { record }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving medical record',
      data: { error: error.message }
    });
  }
};

// @desc    Create new medical record
// @route   POST /api/medical-records
// @access  Private (Doctor only)
exports.createMedicalRecord = async (req, res) => {
  try {
    // Verify doctor profile exists
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can create medical records',
        data: null
      });
    }

    const recordData = {
      ...req.body,
      doctor: doctorProfile._id,
      hospital: doctorProfile.hospital
    };

    const record = await MedicalRecord.create(recordData);
    await record.populate([
      { path: 'patient', select: 'fullName email phoneNumber' },
      { path: 'doctor', populate: { path: 'user hospital', select: 'fullName name' } },
      { path: 'hospital', select: 'name location' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      data: { record }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating medical record',
      data: { error: error.message }
    });
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor who created it only)
exports.updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found',
        data: null
      });
    }

    // Check if current user is the doctor who created the record
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile || record.doctor.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medical record',
        data: null
      });
    }

    const updatedRecord = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient', select: 'fullName email phoneNumber' },
      { path: 'doctor', populate: { path: 'user hospital', select: 'fullName name' } },
      { path: 'hospital', select: 'name location' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Medical record updated successfully',
      data: { record: updatedRecord }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating medical record',
      data: { error: error.message }
    });
  }
};

// @desc    Get patient's medical history
// @route   GET /api/patients/:patientId/medical-records
// @access  Private (Patient themselves, their doctors, or admin)
exports.getPatientMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check permissions
    const isPatient = req.user._id.toString() === patientId;
    const isAdmin = req.user.role === 'admin';
    
    // For doctors, check if they have treated this patient
    let isPatientDoctor = false;
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (doctorProfile) {
        // Check if the doctor has any appointments (past or present) with this patient
        const hasAppointment = await Appointment.findOne({
          patient: patientId,
          doctor: req.user._id, // Match by the logged-in user's ID (which is the doctor's User ID)
        });
        isPatientDoctor = !!hasAppointment;
      }
    }
    
    if (!isPatient && !isAdmin && !isPatientDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this patient\'s medical history',
        data: null
      });
    }

    const records = await MedicalRecord.find({ patient: patientId })
      .populate('doctor', 'specialization licenseNumber')
      .populate({
        path: 'doctor',
        populate: { path: 'user hospital', select: 'fullName name location' }
      })
      .populate('hospital', 'name location')
      .populate('prescriptions')
      .sort({ visitDate: -1 });

    // Group records by year and month for better organization
    const groupedRecords = records.reduce((acc, record) => {
      const date = new Date(record.visitDate);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = [];
      }
      acc[yearMonth].push(record);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: 'Patient medical history retrieved successfully',
      data: { 
        records, 
        groupedRecords,
        totalRecords: records.length 
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient medical history',
      data: { error: error.message }
    });
  }
};

// @desc    Get count of medical records (public for stats)
// @route   GET /api/medical-records/count
// @access  Public
exports.getMedicalRecordsCount = async (req, res) => {
  try {
    const count = await MedicalRecord.countDocuments({});
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting medical records count',
      count: 1456 // Default fallback
    });
  }
};

// @desc    Search medical records by diagnosis
// @route   GET /api/medical-records/search
// @access  Private (Doctor/Admin)
exports.searchMedicalRecords = async (req, res) => {
  try {
    const { diagnosis, symptoms, patient } = req.query;
    
    let filter = {};
    
    if (diagnosis) {
      filter.$or = [
        { 'diagnosis.primary': new RegExp(diagnosis, 'i') },
        { 'diagnosis.secondary': new RegExp(diagnosis, 'i') }
      ];
    }
    
    if (symptoms) {
      filter.symptoms = new RegExp(symptoms, 'i');
    }
    
    if (patient) {
      filter.patient = patient;
    }

    // If user is a doctor, only show their records
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (doctorProfile) {
        filter.doctor = doctorProfile._id;
      }
    }

    const records = await MedicalRecord.find(filter)
      .populate('patient', 'fullName age')
      .populate('doctor', 'specialization')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'fullName' }
      })
      .populate('hospital', 'name')
      .sort({ visitDate: -1 })
      .limit(50); // Limit results for performance

    res.status(200).json({
      success: true,
      message: 'Medical records search completed',
      data: { records, count: records.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching medical records',
      data: { error: error.message }
    });
  }
};