const Patient = require('../models/Patient');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const crypto = require('crypto');
const { sendOTPEmail } = require('../services/emailService');

// @desc    Get count of patients (public for stats)
// @route   GET /api/patients/count
// @access  Public
exports.getPatientsCount = async (req, res) => {
  try {
    const count = await Patient.countDocuments({});
    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting patients count',
      count: 300 // Default fallback
    });
  }
};

// Multer storage to temp disk
// Increased limits: 15MB per file, 50MB total form size
const upload = multer({
  dest: path.join(__dirname, '..', 'uploads', 'tmp'),
  limits: { 
    fileSize: 15 * 1024 * 1024, // 15MB per file (increased from 5MB)
    fieldSize: 10 * 1024 * 1024, // 10MB for text fields
    fieldNameSize: 100, // Field name size
    fields: 50, // Max number of non-file fields
    files: 15, // Max number of file fields
  },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','application/pdf','image/jpg'];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Invalid file type. Allowed: pdf, jpg, jpeg, png'));
  }
});

exports.patientRegisterUpload = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'idDocument', maxCount: 1 },
  { name: 'insuranceFront', maxCount: 1 },
  { name: 'insuranceBack', maxCount: 1 },
  { name: 'medicalFiles', maxCount: 10 }
]);

// Add logging middleware wrapper
const originalUpload = exports.patientRegisterUpload;
exports.patientRegisterUpload = (req, res, next) => {
  console.log('\n📎 ============================================');
  console.log('📎 [BACKEND] Multer Upload Middleware');
  console.log('📎 ============================================');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Method:', req.method);
  console.log('🔗 URL:', req.originalUrl);
  console.log('📋 Content-Type:', req.headers['content-type']);
  console.log('📏 Content-Length:', req.headers['content-length']);
  console.log('📋 Content-Disposition:', req.headers['content-disposition']);
  
  // Log when files are received
  const originalEnd = res.end;
  res.end = function(...args) {
    console.log('📎 [BACKEND] Upload middleware completed');
    console.log('   req.files:', req.files ? 'Present' : 'Missing');
    console.log('   req.body keys:', Object.keys(req.body || {}));
    console.log('📎 ============================================\n');
    return originalEnd.apply(this, args);
  };
  
  // Call original middleware
  originalUpload(req, res, (err) => {
    if (err) {
      console.error('❌ [BACKEND] Multer upload error:', err);
      console.error('   Error message:', err.message);
      console.error('   Error code:', err.code);
      console.error('   Error field:', err.field);
      
      // Handle specific error types with user-friendly messages
      if (err.code === 'LIMIT_FILE_SIZE') {
        const maxSizeMB = 15;
        const fileSizeMB = err.field ? `File "${err.field}"` : 'A file';
        console.error(`   ${fileSizeMB} exceeds the maximum size of ${maxSizeMB}MB`);
        // Create a user-friendly error
        const friendlyError = new Error(`${fileSizeMB} exceeds the maximum size of ${maxSizeMB}MB. Please compress or resize your file.`);
        friendlyError.code = err.code;
        friendlyError.field = err.field;
        return next(friendlyError);
      }
      
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        const friendlyError = new Error(`Unexpected file field: ${err.field}. Please check your file uploads.`);
        friendlyError.code = err.code;
        return next(friendlyError);
      }
    } else {
      console.log('✅ [BACKEND] Multer upload successful');
      if (req.files) {
        console.log('   Files processed:', Object.keys(req.files).length, 'field(s)');
        // Log file sizes
        Object.keys(req.files).forEach(key => {
          const files = req.files[key];
          if (Array.isArray(files)) {
            files.forEach((file, idx) => {
              const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
              console.log(`     [${idx}] ${key}: ${file.originalname} (${sizeMB} MB)`);
            });
          } else {
            const sizeMB = (files.size / (1024 * 1024)).toFixed(2);
            console.log(`     ${key}: ${files.originalname} (${sizeMB} MB)`);
          }
        });
      }
    }
    next(err);
  });
};

function isE164(phone) {
  return /^\+[1-9]\d{6,14}$/.test(phone);
}

async function uploadToCloud(file) {
  const result = await cloudinary.uploader.upload(file.path, { folder: 'onehealth/patients' });
  try { fs.unlinkSync(file.path); } catch {}
  return result.secure_url;
}

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
      const hospitalDoc = await Hospital.findById(req.user.hospital);
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
    console.log('Patient ID from params:', req.params.id);
    console.log('User making request:', req.user.role, req.user._id);

    const patient = await Patient.findOne({ user: req.params.id })
      .populate('user', 'name email phone isActive isVerified')
      .populate('primaryHospital', 'name location contact')
      .populate('visitedHospitals.hospital', 'name location')
      .populate('medicalRecords');

    console.log("Backend: getPatient - Found Patient:", patient ? patient._id : "None");

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

// @desc    Public patient registration (creates User + stores files)
// @route   POST /api/patients/register
// @access  Public
exports.publicRegisterPatient = async (req, res) => {
  console.log('\n🔵 ============================================');
  console.log('🔵 [BACKEND] Patient Registration Started');
  console.log('🔵 ============================================');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('🌐 Method:', req.method);
  console.log('🔗 URL:', req.originalUrl);
  console.log('📋 Content-Type:', req.headers['content-type']);
  console.log('📏 Content-Length:', req.headers['content-length']);
  
  try {
    // Log request body (excluding password)
    console.log('📦 [BACKEND] Request body received:');
    const bodyToLog = { ...req.body };
    if (bodyToLog.password) bodyToLog.password = '[REDACTED]';
    console.log('   Body keys:', Object.keys(req.body));
    console.log('   Body values (sanitized):', bodyToLog);
    
    // Log files
    console.log('📎 [BACKEND] Files received:');
    console.log('   req.files:', req.files ? 'Present' : 'Missing');
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        const files = req.files[key];
        console.log(`   ${key}:`, Array.isArray(files) ? `${files.length} file(s)` : '1 file');
        if (Array.isArray(files)) {
          files.forEach((file, idx) => {
            console.log(`     [${idx}] ${file.originalname} (${file.size} bytes, ${file.mimetype})`);
          });
        } else {
          console.log(`     ${files.originalname} (${files.size} bytes, ${files.mimetype})`);
        }
      });
    }

    console.log(`📝 [BACKEND] Registration attempt for: ${req.body.email || 'unknown email'}`);

    const {
      firstName, lastName, email, phone, password,
      dob, gender, nationalId, address, district, province, ubudehe,
      emergencyContactName, emergencyContactRelation, emergencyContactPhone,
      insuranceType, insurerName, policyNumber, policyHolderName, policyExpiry,
      bloodGroup, allergies, medications, pastMedicalHistory, chronicConditions, currentSymptoms
    } = req.body;
    
    console.log('✅ [BACKEND] Extracted form fields from req.body');

    // Enhanced validation to match frontend
    console.log('🔍 [BACKEND] Starting validation...');
    if (!firstName || !lastName || !email || !phone || !password) {
      console.error('❌ [BACKEND] Validation failed: Missing required personal information fields');
      console.error('   firstName:', firstName ? '✓' : '✗');
      console.error('   lastName:', lastName ? '✓' : '✗');
      console.error('   email:', email ? '✓' : '✗');
      console.error('   phone:', phone ? '✓' : '✗');
      console.error('   password:', password ? '✓' : '✗');
      return res.status(400).json({ status: 'fail', message: 'Missing required personal information fields' });
    }
    console.log('✅ [BACKEND] Required personal info fields present');
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ status: 'fail', message: 'Please enter a valid email address' });
    }
    
    // Phone E.164 validation
    if (!isE164(phone)) {
      return res.status(400).json({ status: 'fail', message: 'Phone must be in E.164 format (e.g., +2507XXXXXXXX)' });
    }
    
    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ status: 'fail', message: 'Password must be at least 8 characters' });
    }
    
    // Identity & Address validation
    if (!dob || new Date(dob) >= new Date()) {
      return res.status(400).json({ status: 'fail', message: 'Date of birth must be in the past' });
    }
    if (!nationalId || !address || !district || !province) {
      return res.status(400).json({ status: 'fail', message: 'Missing required identity and address fields' });
    }
    
    // Emergency contact validation
    if (!emergencyContactName || !emergencyContactRelation || !emergencyContactPhone) {
      return res.status(400).json({ status: 'fail', message: 'Please fill in all emergency contact fields' });
    }
    if (!isE164(emergencyContactPhone)) {
      return res.status(400).json({ status: 'fail', message: 'Emergency contact phone must be in E.164 format (e.g., +2507XXXXXXXX)' });
    }
    
    // Insurance validation (conditional)
    if (insuranceType && insuranceType !== 'None') {
      if (!insurerName || !policyNumber || !policyHolderName || !policyExpiry) {
        return res.status(400).json({ status: 'fail', message: 'Please fill in all insurance fields' });
      }
    }
    
    // Medical history validation
    if (!allergies || !medications || !pastMedicalHistory || !chronicConditions || !currentSymptoms) {
      return res.status(400).json({ status: 'fail', message: 'Please fill in all medical history fields (enter "None" if not applicable)' });
    }

    console.log('🔍 [BACKEND] Checking for existing user...');
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      const field = existing.email === email ? 'email' : 'phone';
      console.error(`❌ [BACKEND] User already exists with ${field}:`, field === 'email' ? email : phone);
      return res.status(400).json({ 
        status: 'fail', 
        message: `This ${field} is already registered. Please use a different ${field} or try logging in.` 
      });
    }
    console.log('✅ [BACKEND] No existing user found, proceeding with registration');

    // File validation (required files)
    console.log('🔍 [BACKEND] Validating required files...');
    if (!req.files?.profileImage?.[0]) {
      console.error('❌ [BACKEND] Validation failed: Profile image is required');
      console.error('   req.files:', req.files ? 'Present' : 'Missing');
      console.error('   req.files.profileImage:', req.files?.profileImage);
      return res.status(400).json({ status: 'fail', message: 'Profile image is required' });
    }
    console.log('✅ [BACKEND] Profile image present');
    
    if (!req.files?.idDocument?.[0]) {
      console.error('❌ [BACKEND] Validation failed: National ID scan is required');
      console.error('   req.files.idDocument:', req.files?.idDocument);
      return res.status(400).json({ status: 'fail', message: 'National ID scan is required' });
    }
    console.log('✅ [BACKEND] ID document present');
    if (insuranceType && insuranceType !== 'None' && !req.files?.insuranceFront?.[0]) {
      return res.status(400).json({ status: 'fail', message: 'Insurance card front is required' });
    }

    // Upload files
    console.log('☁️ [BACKEND] Starting file uploads to Cloudinary...');
    try {
    const profileImageUrl = await uploadToCloud(req.files.profileImage[0]);
      console.log('✅ [BACKEND] Profile image uploaded:', profileImageUrl);
      
    const idDocumentUrl = await uploadToCloud(req.files.idDocument[0]);
      console.log('✅ [BACKEND] ID document uploaded:', idDocumentUrl);
      
    const insuranceFrontUrl = req.files?.insuranceFront?.[0] ? await uploadToCloud(req.files.insuranceFront[0]) : undefined;
      if (insuranceFrontUrl) console.log('✅ [BACKEND] Insurance front uploaded:', insuranceFrontUrl);
      
    const insuranceBackUrl = req.files?.insuranceBack?.[0] ? await uploadToCloud(req.files.insuranceBack[0]) : undefined;
      if (insuranceBackUrl) console.log('✅ [BACKEND] Insurance back uploaded:', insuranceBackUrl);

    const additionalDocuments = [];
    if (req.files?.medicalFiles) {
        console.log(`📎 [BACKEND] Uploading ${req.files.medicalFiles.length} medical file(s)...`);
      for (const f of req.files.medicalFiles) {
        const url = await uploadToCloud(f);
        additionalDocuments.push({ fileName: f.originalname, url });
          console.log(`✅ [BACKEND] Medical file uploaded: ${f.originalname}`);
      }
    }

    // Create User with all patient data (auto-activated)
      console.log('👤 [BACKEND] Creating user account...');
    const userData = {
      firstName, lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      password,
      role: 'patient',
      isActive: true,
      isVerified: true,
      dob,
      gender,
      nationalId,
      address,
      district,
      province,
      ubudehe: parseInt(ubudehe) || 1,
      emergencyContact: { 
        name: emergencyContactName, 
        relation: emergencyContactRelation, 
        phone: emergencyContactPhone 
      },
      insurance: { 
        type: insuranceType || 'None', 
        insurerName: insuranceType !== 'None' ? insurerName : undefined, 
        policyNumber: insuranceType !== 'None' ? policyNumber : undefined, 
        policyHolderName: insuranceType !== 'None' ? policyHolderName : undefined, 
        expiryDate: insuranceType !== 'None' ? policyExpiry : undefined, 
        frontUrl: insuranceFrontUrl, 
        backUrl: insuranceBackUrl 
      },
      bloodGroup: bloodGroup || 'Unknown', // Optional field with default
      allergies: Array.isArray(allergies) ? allergies : (allergies ? [allergies] : []),
      medications: Array.isArray(medications) ? medications : (medications ? [medications] : []),
      pastMedicalHistory,
      chronicConditions: Array.isArray(chronicConditions) ? chronicConditions : (chronicConditions ? [chronicConditions] : []),
      currentSymptoms,
      profileImageUrl,
      idDocumentUrl,
      additionalDocuments
    };

    const user = await User.create(userData);
      console.log('✅ [BACKEND] User account created successfully');
      console.log('   User ID:', user._id.toString());
      console.log('   Email:', user.email.replace(/(^.).+(@.*$)/, (m, a, b) => a + '***' + b));
      console.log('   Role:', user.role);
      console.log('   Is Active:', user.isActive);
      console.log('   Is Verified:', user.isVerified);

    // Skip OTP generation and email verification for testing
    console.log(`[PATIENT REGISTRATION] User registered and auto-activated:`, { 
      id: user._id.toString(), 
      email: user.email.replace(/(^.).+(@.*$)/, (m, a, b) => a + '***' + b), 
      role: user.role 
    });

    // Generate unique patient ID
      console.log('🆔 [BACKEND] Generating unique patient ID...');
    let patientId;
    let attempts = 0;
    do {
      const patientCount = await Patient.countDocuments();
      patientId = `PAT-${String(patientCount + 1 + attempts).padStart(6, '0')}`;
      attempts++;
      
      // Check if this ID already exists
      const existingPatient = await Patient.findOne({ patientId });
      if (!existingPatient) break;
      
      if (attempts > 10) {
        throw new Error('Unable to generate unique patient ID');
      }
    } while (true);
      console.log('✅ [BACKEND] Patient ID generated:', patientId);

    // Also create Patient profile shell
      console.log('🏥 [BACKEND] Creating patient profile...');
    const patient = await Patient.create({
      user: user._id,
      patientId,
      dateOfBirth: dob,
      gender,
      phone,
      address: { street: address, district, province, city: undefined },
      emergencyContact: { 
        name: emergencyContactName, 
        relationship: emergencyContactRelation, 
        phone: emergencyContactPhone 
      },
      bloodType: bloodGroup || 'Unknown',
      allergies: user.allergies,
      chronicConditions: user.chronicConditions,
      insurance: { 
        provider: insuranceType || 'None', 
        policyNumber: insuranceType !== 'None' ? policyNumber : undefined, 
        expiryDate: insuranceType !== 'None' ? policyExpiry : undefined 
      }
    });

    // Development logging for new registrations
      console.log(`🎉 [BACKEND] New Patient Registered Successfully!`);
      console.log(`   👤 User: ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📱 Phone: ${user.phone}`);
      console.log(`   🆔 Patient ID: ${patientId}`);
      console.log(`   ✅ Status: ${user.isActive ? 'Active' : 'Pending Verification'}`);

      console.log('📤 [BACKEND] Sending success response...');
    res.status(201).json({
      status: 'success', 
      data: { 
        userId: user._id, 
        patientId: patient._id,
        emailVerificationRequired: false,
        message: 'Registration successful. Your account is now active and ready to use.'
      } 
    });
      console.log('✅ [BACKEND] Response sent successfully');
      console.log('🔵 ============================================');
      console.log('🔵 [BACKEND] Patient Registration Completed');
      console.log('🔵 ============================================\n');
    } catch (uploadError) {
      console.error('❌ [BACKEND] File upload error:', uploadError);
      throw uploadError;
    }
  } catch (error) {
    console.error('\n🔴 ============================================');
    console.error('🔴 [BACKEND] Patient Registration Error');
    console.error('🔴 ============================================');
    console.error('❌ Error type:', error?.constructor?.name || 'Unknown');
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error code:', error?.code);
    console.error('❌ Error field:', error?.field);
    console.error('❌ Error stack:', error?.stack);
    console.error('❌ Full error:', error);
    console.error('🔴 ============================================\n');
    
    // Handle multer errors specifically
    if (error.code === 'LIMIT_FILE_SIZE') {
      const maxSizeMB = 15;
      const fieldName = error.field || 'file';
      return res.status(400).json({ 
        status: 'fail', 
        message: `File "${fieldName}" exceeds the maximum size of ${maxSizeMB}MB. Please compress or resize your file.` 
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        status: 'fail', 
        message: `Unexpected file field: ${error.field}. Please check your file uploads.` 
      });
    }
    
    // Clean up uploaded files if user creation failed
    try {
      if (req.files?.profileImage?.[0]) fs.unlinkSync(req.files.profileImage[0].path);
      if (req.files?.idDocument?.[0]) fs.unlinkSync(req.files.idDocument[0].path);
      if (req.files?.insuranceFront?.[0]) fs.unlinkSync(req.files.insuranceFront[0].path);
      if (req.files?.insuranceBack?.[0]) fs.unlinkSync(req.files.insuranceBack[0].path);
      if (req.files?.medicalFiles) {
        req.files.medicalFiles.forEach(f => {
          try { fs.unlinkSync(f.path); } catch {}
        });
      }
    } catch (cleanupError) {
      console.error('File cleanup error:', cleanupError);
    }
    
    // Handle specific error types
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        status: 'fail', 
        message: `${field === 'email' ? 'Email' : field === 'phone' ? 'Phone' : 'Field'} already exists` 
      });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        status: 'fail', 
        message: `Validation error: ${errors.join(', ')}` 
      });
    }
    
    res.status(500).json({ 
      status: 'fail', 
      message: error.message || 'Registration failed. Please try again.' 
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
    const hospital = await Hospital.findById(user.hospital);
    if (hospital) {
      const hasVisited = patient.visitedHospitals.some(
        visit => visit.hospital.toString() === hospital._id.toString()
      );
      return hasVisited;
    }
  }
  
  // Doctor can access patients they have appointments with
  if (user.role === 'doctor') {
    console.log("Access Check: Doctor attempting to access patient.");
    console.log("Access Check: Patient User ID:", patient.user.toString());
    console.log("Access Check: Doctor User ID:", user._id.toString());
    const appointment = await Appointment.findOne({
      patient: patient.user,
      doctor: user._id
    });
    console.log("Access Check: Appointment Found for Doctor/Patient:", !!appointment);
    return !!appointment;
  }
  
  return false;
}

// @desc    Get patients assigned to the logged-in doctor
// @route   GET /api/patients/my-patients
// @access  Private (Doctor)
exports.getDoctorPatients = async (req, res) => {
  try {
    console.log('=== GET DOCTOR PATIENTS ===');
    console.log('Logged-in Doctor User ID:', req.user._id);

    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    // Find all appointments for the logged-in doctor
    const doctorAppointments = await Appointment.find({ doctor: req.user._id }).select('patient');
    const patientUserIds = [...new Set(doctorAppointments.map(app => app.patient.toString()))];

    let filter = { user: { $in: patientUserIds }, isActive: true };

    // Add search functionality for patient names/emails
    if (search) {
      const users = await User.find({
        $and: [
          { _id: { $in: patientUserIds } }, // Ensure users are among the doctor's patients
          {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { email: { $regex: search, $options: 'i' } }
            ]
          }
        ]
      }).select('_id');
      filter.user = { $in: users.map(u => u._id) };
    }

    const patients = await Patient.find(filter)
      .populate('user', 'name email phone profileImage')
      .populate('primaryHospital', 'name location')
      .populate('visitedHospitals.hospital', 'name location')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Patient.countDocuments(filter);

    console.log(`Doctor ${req.user.name} found ${patients.length} patients out of ${total} total assigned.`);

    res.status(200).json({
      success: true,
      message: 'Doctor\'s patients retrieved successfully',
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
    console.error('Error in getDoctorPatients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctor\'s patients',
      data: null
    });
  }
};

// module.exports = {
//   getAllPatients,
//   getPatient,
//   createPatient,
//   updatePatient,
//   getPatientsByHospital,
//   addHospitalVisit
// };

// module.exports = {
//   getAllPatients,
//   getPatient,
//   createPatient,
//   updatePatient,
//   getPatientsByHospital,
//   addHospitalVisit
// };