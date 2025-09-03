const Patient = require('../models/Patient');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get all patients (with hospital filtering)
// @route   GET /api/patients
// @access  Private (Admin or Hospital)
exports.getAllPatients = async (req, res) => {
  try {
    console.log('=== GET ALL PATIENTS ===');
    console.log('User:', req.user.role, req.user._id);
    console.log('Query params:', req.query);

    const { page = 1, limit = 10, hospital, search } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isActive: true };

    // Hospital role can only see their patients
    if (req.user.role === 'hospital') {
      const hospitalDoc = await Hospital.findOne({ userId: req.user._id });
      if (!hospitalDoc) {
        return res.status(403).json({
          success: false,
          message: 'Hospital profile not found',
          data: null
        });
      }
      // Filter patients who have visited this hospital
      filter['visitedHospitals.hospital'] = hospitalDoc._id;
      console.log('Hospital filter applied:', hospitalDoc._id);
    } else if (hospital && req.user.role === 'admin') {
      // Admin can filter by specific hospital
      filter['visitedHospitals.hospital'] = hospital;
    }

    // Search filter
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      filter.user = { $in: users.map(u => u._id) };
    }

    const patients = await Patient.find(filter)
      .populate('user', 'name email isActive isVerified')
      .populate('primaryHospital', 'name location')
      .populate('visitedHospitals.hospital', 'name location')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Patient.countDocuments(filter);

    console.log(`Found ${patients.length} patients out of ${total} total`);

    res.status(200).json({
      success: true,
      message: 'Patients retrieved successfully',
      data: {
        patients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalPatients: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patients',
      data: null
    });
  }
};

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private (Admin, Hospital, or Patient themselves)
exports.getPatient = async (req, res) => {
  try {
    console.log('=== GET PATIENT ===');
    console.log('Patient ID:', req.params.id);
    console.log('User:', req.user.role, req.user._id);

    const patient = await Patient.findById(req.params.id)
      .populate('user', 'name email phone isActive isVerified')
      .populate('primaryHospital', 'name location contact')
      .populate('visitedHospitals.hospital', 'name location')
      .populate('medicalRecords');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        data: null
      });
    }

    // Check authorization
    const canView = await checkPatientAccess(req.user, patient);
    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this patient',
        data: null
      });
    }

    // Get recent appointments
    const recentAppointments = await Appointment.find({ 
      patient: patient.user._id 
    })
    .populate('hospital', 'name')
    .populate('doctor', 'specialization')
    .populate('department', 'name')
    .sort({ appointmentDate: -1 })
    .limit(5);

    res.status(200).json({
      success: true,
      message: 'Patient retrieved successfully',
      data: { 
        patient,
        recentAppointments
      }
    });
  } catch (error) {
    console.error('Error in getPatient:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve patient',
      data: null
    });
  }
};

// @desc    Create patient profile
// @route   POST /api/patients
// @access  Private (Admin or Patient themselves)
exports.createPatient = async (req, res) => {
  try {
    console.log('=== CREATE PATIENT ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user.role, req.user._id);

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ user: req.body.user || req.user._id });
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient profile already exists',
        data: null
      });
    }

    // Create patient data
    const patientData = {
      ...req.body,
      user: req.body.user || req.user._id
    };

    // If user is creating their own profile, validate user is patient role
    if (!req.body.user && req.user.role !== 'patient') {
      return res.status(403).json({
        success: false,
        message: 'Only patients can create their own profile',
        data: null
      });
    }

    const patient = await Patient.create(patientData);
    await patient.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'primaryHospital', select: 'name location' }
    ]);

    console.log('Patient created:', patient.patientId);

    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully',
      data: { patient }
    });
  } catch (error) {
    console.error('Error in createPatient:', error);
    res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/:id
// @access  Private (Admin, Patient themselves, or their Hospital)
exports.updatePatient = async (req, res) => {
  try {
    console.log('=== UPDATE PATIENT ===');
    console.log('Patient ID:', req.params.id);
    console.log('Updates:', req.body);

    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        data: null
      });
    }

    // Check authorization
    const canUpdate = await checkPatientAccess(req.user, patient);
    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this patient',
        data: null
      });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'name email phone' },
      { path: 'primaryHospital', select: 'name location' },
      { path: 'visitedHospitals.hospital', select: 'name location' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: { patient: updatedPatient }
    });
  } catch (error) {
    console.error('Error in updatePatient:', error);
    res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get patients by hospital
// @route   GET /api/hospitals/:hospitalId/patients
// @access  Private (Admin or Hospital)
exports.getPatientsByHospital = async (req, res) => {
  try {
    console.log('=== GET PATIENTS BY HOSPITAL ===');
    console.log('Hospital ID:', req.params.hospitalId);
    console.log('User:', req.user.role, req.user._id);

    // Check if user can access this hospital's patients
    if (req.user.role === 'hospital') {
      const userHospital = await Hospital.findOne({ userId: req.user._id });
      if (!userHospital || userHospital._id.toString() !== req.params.hospitalId) {
        return res.status(403).json({
          success: false,
          message: 'Can only access your own hospital patients',
          data: null
        });
      }
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const patients = await Patient.find({
      'visitedHospitals.hospital': req.params.hospitalId,
      isActive: true
    })
    .populate('user', 'name email phone')
    .populate('primaryHospital', 'name location')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ 'visitedHospitals.lastVisit': -1 });

    const total = await Patient.countDocuments({
      'visitedHospitals.hospital': req.params.hospitalId,
      isActive: true
    });

    res.status(200).json({
      success: true,
      message: 'Hospital patients retrieved successfully',
      data: {
        patients,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalPatients: total
        }
      }
    });
  } catch (error) {
    console.error('Error in getPatientsByHospital:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hospital patients',
      data: null
    });
  }
};

// @desc    Add hospital visit to patient record
// @route   POST /api/patients/:id/visits
// @access  Private (Hospital or Admin)
exports.addHospitalVisit = async (req, res) => {
  try {
    const { hospitalId } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
        data: null
      });
    }

    // Find existing hospital visit or create new one
    const existingVisit = patient.visitedHospitals.find(
      visit => visit.hospital.toString() === hospitalId
    );

    if (existingVisit) {
      existingVisit.lastVisit = new Date();
      existingVisit.totalVisits += 1;
    } else {
      patient.visitedHospitals.push({
        hospital: hospitalId,
        firstVisit: new Date(),
        lastVisit: new Date(),
        totalVisits: 1
      });
    }

    await patient.save();
    await patient.populate('visitedHospitals.hospital', 'name location');

    res.status(200).json({
      success: true,
      message: 'Hospital visit added successfully',
      data: { patient }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Helper function to check patient access
async function checkPatientAccess(user, patient) {
  console.log('Checking patient access for user:', user.role, user._id);
  
  // Admin can access all patients
  if (user.role === 'admin') return true;
  
  // Patient can access their own profile
  if (user.role === 'patient' && patient.user.toString() === user._id.toString()) {
    return true;
  }
  
  // Hospital can access patients who have visited their hospital
  if (user.role === 'hospital') {
    const hospital = await Hospital.findOne({ userId: user._id });
    if (hospital) {
      const hasVisited = patient.visitedHospitals.some(
        visit => visit.hospital.toString() === hospital._id.toString()
      );
      return hasVisited;
    }
  }
  
  // Doctor can access patients they have appointments with
  if (user.role === 'doctor') {
    const appointment = await Appointment.findOne({
      patient: patient.user,
      doctor: user._id
    });
    return !!appointment;
  }
  
  return false;
}

module.exports = {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  getPatientsByHospital,
  addHospitalVisit
};