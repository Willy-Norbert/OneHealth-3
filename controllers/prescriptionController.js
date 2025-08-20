const Prescription = require('../models/Prescription');
const Doctor = require('../models/Doctor');

// @desc    Get all prescriptions with filtering
// @route   GET /api/prescriptions
// @access  Private (Doctor/Admin)
exports.getAllPrescriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { patient, doctor, status } = req.query;
    
    let filter = {};
    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (status) filter.status = status;

    // If user is a doctor, only show their prescriptions
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ user: req.user._id });
      if (doctorProfile) {
        filter.doctor = doctorProfile._id;
      }
    }

    const prescriptions = await Prescription.find(filter)
      .populate('patient', 'fullName email phoneNumber')
      .populate('doctor', 'specialization licenseNumber')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'fullName' }
      })
      .skip(skip)
      .limit(limit)
      .sort({ issuedDate: -1 });

    const total = await Prescription.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Prescriptions retrieved successfully',
      data: { 
        prescriptions, 
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
      message: 'Error retrieving prescriptions',
      data: { error: error.message }
    });
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private (Patient/Doctor/Admin)
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'fullName email phoneNumber')
      .populate('doctor', 'specialization licenseNumber')
      .populate({
        path: 'doctor',
        populate: { path: 'user hospital', select: 'fullName name location' }
      })
      .populate('consultation')
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
        data: null
      });
    }

    // Check permissions
    const isPatient = req.user._id.toString() === prescription.patient._id.toString();
    const isDoctor = await Doctor.findOne({ 
      user: req.user._id, 
      _id: prescription.doctor._id 
    });
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this prescription',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Prescription retrieved successfully',
      data: { prescription }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving prescription',
      data: { error: error.message }
    });
  }
};

// @desc    Create new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
exports.createPrescription = async (req, res) => {
  try {
    // Verify doctor profile exists
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile) {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can create prescriptions',
        data: null
      });
    }

    // Set expiry date (default 30 days from issue date)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const prescriptionData = {
      ...req.body,
      doctor: doctorProfile._id,
      expiryDate: req.body.expiryDate || expiryDate
    };

    const prescription = await Prescription.create(prescriptionData);
    await prescription.populate([
      { path: 'patient', select: 'fullName email phoneNumber' },
      { path: 'doctor', populate: { path: 'user hospital', select: 'fullName name' } }
    ]);

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: { prescription }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating prescription',
      data: { error: error.message }
    });
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private (Doctor who created it only)
exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found',
        data: null
      });
    }

    // Check if current user is the doctor who created the prescription
    const doctorProfile = await Doctor.findOne({ user: req.user._id });
    if (!doctorProfile || prescription.doctor.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this prescription',
        data: null
      });
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient', select: 'fullName email phoneNumber' },
      { path: 'doctor', populate: { path: 'user hospital', select: 'fullName name' } }
    ]);

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: { prescription: updatedPrescription }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating prescription',
      data: { error: error.message }
    });
  }
};

// @desc    Get patient's prescriptions
// @route   GET /api/patients/:patientId/prescriptions
// @access  Private (Patient themselves, their doctors, or admin)
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check permissions
    const isPatient = req.user._id.toString() === patientId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these prescriptions',
        data: null
      });
    }

    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'specialization licenseNumber')
      .populate({
        path: 'doctor',
        populate: { path: 'user hospital', select: 'fullName name' }
      })
      .sort({ issuedDate: -1 });

    res.status(200).json({
      success: true,
      message: 'Patient prescriptions retrieved successfully',
      data: { prescriptions, count: prescriptions.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient prescriptions',
      data: { error: error.message }
    });
  }
};

// @desc    Upload prescription image
// @route   POST /api/prescriptions/upload
// @access  Private (Patient only)
exports.uploadPrescription = async (req, res) => {
  try {
    // This would typically handle file upload
    // For now, we'll just create a prescription record with image URL
    const prescriptionData = {
      patient: req.user._id,
      prescriptionImage: req.body.imageUrl,
      isDigital: false,
      status: 'active',
      // Other fields would be extracted from image or manually entered
      medications: req.body.medications || [],
      notes: req.body.notes || 'Uploaded prescription image'
    };

    const prescription = await Prescription.create(prescriptionData);

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully',
      data: { prescription }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error uploading prescription',
      data: { error: error.message }
    });
  }
};
