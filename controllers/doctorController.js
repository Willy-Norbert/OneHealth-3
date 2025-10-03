const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');
const Joi = require('joi');

// @desc    Get all doctors with filtering and pagination
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { hospital, department, specialization, isActive, availableOn } = req.query;
    
    const filter = {};
    
    // Hospital-role users can only see doctors from their hospital
    if (req.user?.role === 'hospital') {
      if (req.hospitalId) {
        filter.hospital = req.hospitalId;
      } else {
        return res.status(403).json({
          success: false,
          message: 'Hospital profile not found',
          data: null
        });
      }
    } else {
      // Other users can filter by hospital
      if (hospital) filter.hospital = hospital;
    }
    
    if (department) filter.department = department;
    if (specialization) filter.specialization = specialization;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    let query = Doctor.find(filter)
      .populate('user', 'name email phoneNumber')
      .populate('hospital', 'name location')
      .populate('department', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    // Filter by availability date if provided
    if (availableOn) {
      const date = new Date(availableOn);
      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
      // We cannot filter by computed weekday easily in Mongo without aggregation; fetch and filter in memory for now (small lists typical per hospital)
      const raw = await Doctor.find(filter).populate('user', 'name email phoneNumber').populate('hospital','name location').populate('department','name');
      const filtered = raw.filter((d)=>{
        const s = d.settings;
        if (!s?.defaultAvailability) return true; // no settings means treat as available to not break
        const ex = (s.defaultAvailability.exceptions||[]).find((e)=> new Date(e.date).toDateString() === date.toDateString());
        if (ex) return ex.available !== false;
        const weekdays = s.defaultAvailability.weekdays||[];
        if (weekdays.length === 0) return true; // no restriction
        return weekdays.includes(weekday);
      });
      const total = filtered.length;
      const paged = filtered.slice(skip, skip + limit);
      return res.status(200).json({ success: true, message: 'Doctors retrieved successfully', data: { doctors: paged, pagination: { current: page, pages: Math.ceil(total/limit), total, limit } } });
    }

    const doctors = await query;
    const total = await Doctor.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: { 
        doctors, 
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
      message: 'Error retrieving doctors',
      data: { error: error.message }
    });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phoneNumber')
      .populate('hospital', 'name location contact')
      .populate('department', 'name description');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor retrieved successfully',
      data: { doctor }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving doctor',
      data: { error: error.message }
    });
  }
};

// @desc    Create new doctor
// @route   POST /api/doctors
// @access  Private (Admin or Hospital)
exports.createDoctor = async (req, res) => {
  try {
    // Verify user exists and has doctor role
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    if (user.role === undefined) {
      return res.status(400).json({
        success: false,
        message: 'User has no role',
        data: null
      });
    }
    console.log('User role in createDoctor:', user.role);
    if (user.role !== 'doctor' && user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User must have doctor or admin role',
        data: null
      });
    }

    // Determine hospital ID based on user role
    let hospitalId;
    if (req.user.role === 'hospital') {
      // Hospital users can only create doctors for their own hospital
      if (!req.hospitalId) {
        return res.status(403).json({
          success: false,
          message: 'Hospital profile not found',
          data: null
        });
      }
      hospitalId = req.hospitalId;
    } else if (req.user.role === 'admin') {
      // Admin can specify hospital
      hospitalId = req.body.hospital;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only admin or hospital users can create doctors',
        data: null
      });
    }

    // Verify hospital exists
    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(400).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    const department = await Department.findById(req.body.department);
    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Department not found',
        data: null
      });
    }

    // Check if doctor already exists for this user
    const existingDoctor = await Doctor.findOne({ user: req.body.user });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists for this user',
        data: null
      });
    }

    const doctor = await Doctor.create({
      ...req.body,
      hospital: hospitalId
    });
    await doctor.populate([
      { path: 'user', select: 'name email phoneNumber' },
      { path: 'hospital', select: 'name location' },
      { path: 'department', select: 'name' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { doctor }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating doctor',
      data: { error: error.message }
    });
  }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
// @access  Private (Admin or Doctor themselves)
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        data: null
      });
    }

    // Check permissions - admin can update any doctor, doctors can only update themselves
    if (req.user.role !== 'admin' && doctor.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this doctor profile',
        data: null
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'name email phoneNumber' },
      { path: 'hospital', select: 'name location' },
      { path: 'department', select: 'name' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: { doctor: updatedDoctor }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating doctor',
      data: { error: error.message }
    });
  }
};

// @desc    Delete doctor
// @route   DELETE /api/doctors/:id
// @access  Private (Admin only)
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting doctor',
      data: { error: error.message }
    });
  }
};

// @desc    Get doctors by department
// @route   GET /api/departments/:departmentId/doctors
// @access  Public
exports.getDoctorsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    // Validate departmentId
    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID',
        data: null
      });
    }

    // Find active doctors in department
    const doctors = await Doctor.find({ 
      department: departmentId,
      isActive: true 
    })
    .populate('user', 'name email phoneNumber')
    .populate('hospital', 'name location')
    .populate('department', 'name')
    .sort({ createdAt: -1 }); // safer than rating.average

    res.status(200).json({
      success: true,
      message: 'Department doctors retrieved successfully',
      data: { doctors, count: doctors.length }
    });
  } catch (error) {
    console.error('Error retrieving department doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving department doctors',
      data: { error: error.message }
    });
  }
};

// @desc    Get doctor's profile by user ID
// @route   GET /api/doctors/profile/:userId
// @access  Public
exports.getDoctorByUserId = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.userId })
      .populate('user', 'name email phoneNumber')
      .populate('hospital', 'name location contact')
      .populate('department', 'name description');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Doctor profile retrieved successfully',
      data: { doctor }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving doctor profile',
      data: { error: error.message }
    });
  }
};

// @desc    Get doctors by hospital and department
// @route   GET /api/doctors/hospital/:hospitalId/department/:departmentId
// @access  Public
exports.getDoctorsByHospitalAndDepartment = async (req, res) => {
  try {
    const { hospitalId, departmentId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(hospitalId) || !mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hospital ID or department ID',
        data: null
      });
    }

    // Find active doctors in the specified hospital and department
    const doctors = await Doctor.find({
      hospital: hospitalId,
      department: departmentId,
      isActive: true
    })
    .populate('user', 'name email phoneNumber')
    .populate('hospital', 'name location')
    .populate('department', 'name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data: { doctors, count: doctors.length }
    });
  } catch (error) {
    console.error('Error retrieving doctors by hospital and department:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving doctors by hospital and department',
      data: { error: error.message }
    });
  }
};

// @desc    Get current doctor's settings
// @route   GET /api/doctors/settings
// @access  Private (Doctor)
exports.getMySettings = async (req, res) => {
  try {
    console.log('[GET /doctors/settings] user:', req.user?._id, 'role:', req.user?.role)
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required', data: null });
    }
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Only doctors can access settings', data: null });
    }
    let doc;
    try {
      doc = await Doctor.findOne({ user: req.user._id }).select('settings');
    } catch (err) {
      console.error('[GET /doctors/settings] DB error:', err);
      return res.status(500).json({ success: false, message: 'Database error', data: { error: err.message } });
    }
    if (!doc) {
      console.warn('[GET /doctors/settings] Doctor profile not found for user', req.user?._id)
      // Return empty defaults instead of error to avoid client crashes
      return res.status(200).json({ success: true, message: 'No settings found', data: { settings: {} } });
    }
    return res.status(200).json({ success: true, message: 'Settings retrieved', data: { settings: doc.settings || {} } });
  } catch (error) {
    console.error('[GET /doctors/settings] error:', error)
    return res.status(500).json({ success: false, message: 'Failed to retrieve settings', data: { error: error.message } });
  }
};

// @desc    Update current doctor's settings
// @route   PUT /api/doctors/settings
// @access  Private (Doctor)
exports.updateMySettings = async (req, res) => {
  try {
    console.log('[PUT /doctors/settings] user:', req.user?._id, 'role:', req.user?.role, 'body:', req.body)
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Only doctors can update settings', data: null });
    }
    const schema = Joi.object({
      emailNotifications: Joi.boolean().optional(),
      inAppNotifications: Joi.boolean().optional(),
      timezone: Joi.string().optional(),
      defaultAvailability: Joi.object({
        weekdays: Joi.array().items(Joi.string().valid('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')).optional(),
        timeRanges: Joi.array().items(Joi.object({ start: Joi.string().required(), end: Joi.string().required() })).optional(),
        exceptions: Joi.array().items(Joi.object({ date: Joi.alternatives().try(Joi.string(), Joi.date()).required(), available: Joi.boolean().default(false) })).optional(),
      }).optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.warn('[PUT /doctors/settings] validation failed:', error.details?.map(d=>d.message))
      return res.status(400).json({ success: false, message: 'Validation failed', data: { details: error.details.map(d=>d.message) } });
    }

    const doc = await Doctor.findOne({ user: req.user._id });
    if (!doc) {
      console.warn('[PUT /doctors/settings] Doctor profile not found for user', req.user?._id)
      return res.status(404).json({ success: false, message: 'Doctor profile not found', data: null });
    }
    doc.settings = { ...(doc.settings?.toObject?.() || doc.settings || {}), ...value };
    await doc.save();
    return res.status(200).json({ success: true, message: 'Settings updated', data: { settings: doc.settings } });
  } catch (error) {
    console.error('[PUT /doctors/settings] error:', error)
    return res.status(500).json({ success: false, message: 'Failed to update settings', data: { error: error.message } });
  }
};

// @desc    Get or update doctor availability (doctor)
// @route   GET /api/doctors/availability | PUT /api/doctors/availability
// @access  Private (Doctor)
exports.getMyAvailability = async (req, res) => {
  try {
    console.log('[GET /doctors/availability] user:', req.user?._id, 'role:', req.user?.role)
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required', data: null });
    if (req.user.role !== 'doctor') return res.status(403).json({ success: false, message: 'Forbidden', data: null });
    let doc;
    try {
      doc = await Doctor.findOne({ user: req.user._id }).select('settings');
    } catch (err) {
      console.error('[GET /doctors/availability] DB error:', err);
      return res.status(500).json({ success: false, message: 'Database error', data: { error: err.message } });
    }
    if (!doc) {
      console.warn('[GET /doctors/availability] Doctor profile not found for user', req.user?._id)
      // Return empty defaults instead of 404 so UI can render gracefully
      return res.status(200).json({ success: true, message: 'No availability found', data: { availability: {} , locked: false } });
    }
    return res.status(200).json({ success: true, message: 'OK', data: { availability: doc.settings?.defaultAvailability || {} , locked: !!doc.settings?.availabilityLockedByHospital } });
  } catch (e) {
    console.error('[GET /doctors/availability] error:', e)
    return res.status(500).json({ success: false, message: 'Error', data: { error: e.message } });
  }
};

exports.updateMyAvailability = async (req, res) => {
  try {
    console.log('[PUT /doctors/availability] user:', req.user?._id, 'role:', req.user?.role, 'body:', req.body)
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required', data: null });
    if (req.user.role !== 'doctor') return res.status(403).json({ success: false, message: 'Forbidden', data: null });
    const doc = await Doctor.findOne({ user: req.user._id }).select('settings');
    if (!doc) {
      console.warn('[PUT /doctors/availability] Doctor profile not found for user', req.user?._id)
      return res.status(404).json({ success: false, message: 'Doctor profile not found', data: null });
    }
    if (doc.settings?.availabilityLockedByHospital) {
      return res.status(423).json({ success: false, message: 'Availability is locked by hospital', data: null });
    }
    const schema = Joi.object({
      weekdays: Joi.array().items(Joi.string().valid('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')).optional(),
      timeRanges: Joi.array().items(Joi.object({ start: Joi.string().required(), end: Joi.string().required() })).optional(),
      exceptions: Joi.array().items(Joi.object({ date: Joi.alternatives().try(Joi.string(), Joi.date()).required(), available: Joi.boolean().default(false) })).optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.warn('[PUT /doctors/availability] validation failed:', error.details?.map(d=>d.message))
      return res.status(400).json({ success: false, message: 'Validation failed', data: { details: error.details.map(d=>d.message) } });
    }
    doc.settings = doc.settings || {};
    doc.settings.defaultAvailability = { ...(doc.settings.defaultAvailability || {}), ...value };
    await doc.save();
    return res.status(200).json({ success: true, message: 'Availability updated', data: { availability: doc.settings.defaultAvailability } });
  } catch (e) {
    console.error('[PUT /doctors/availability] error:', e)
    return res.status(500).json({ success: false, message: 'Error', data: { error: e.message } });
  }
};

// @desc    Hospital view/update a doctor's availability and lock
// @route   GET /api/doctors/:id/availability | PUT /api/doctors/:id/availability | PUT /api/doctors/:id/availability/lock
// @access  Private (Hospital)
exports.getDoctorAvailabilityByHospital = async (req, res) => {
  try {
    if (req.user.role !== 'hospital') return res.status(403).json({ success: false, message: 'Forbidden', data: null });
    const doc = await Doctor.findById(req.params.id).select('settings');
    if (!doc) return res.status(404).json({ success: false, message: 'Doctor not found', data: null });
    return res.status(200).json({ success: true, message: 'OK', data: { availability: doc.settings?.defaultAvailability || {}, locked: !!doc.settings?.availabilityLockedByHospital } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error', data: { error: e.message } });
  }
};

exports.updateDoctorAvailabilityByHospital = async (req, res) => {
  try {
    if (req.user.role !== 'hospital') return res.status(403).json({ success: false, message: 'Forbidden', data: null });
    const schema = Joi.object({
      weekdays: Joi.array().items(Joi.string()).optional(),
      timeRanges: Joi.array().items(Joi.object({ start: Joi.string().required(), end: Joi.string().required() })).optional(),
      exceptions: Joi.array().items(Joi.object({ date: Joi.date().required(), available: Joi.boolean().default(false) })).optional(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message, data: null });
    const doc = await Doctor.findById(req.params.id).select('settings');
    if (!doc) return res.status(404).json({ success: false, message: 'Doctor not found', data: null });
    doc.settings = doc.settings || {};
    doc.settings.defaultAvailability = { ...(doc.settings.defaultAvailability || {}), ...value };
    await doc.save();
    return res.status(200).json({ success: true, message: 'Availability updated', data: { availability: doc.settings.defaultAvailability } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error', data: { error: e.message } });
  }
};

exports.lockDoctorAvailabilityByHospital = async (req, res) => {
  try {
    if (req.user.role !== 'hospital') return res.status(403).json({ success: false, message: 'Forbidden', data: null });
    const { locked } = req.body || {};
    const doc = await Doctor.findById(req.params.id).select('settings');
    if (!doc) return res.status(404).json({ success: false, message: 'Doctor not found', data: null });
    doc.settings = doc.settings || {};
    doc.settings.availabilityLockedByHospital = !!locked;
    await doc.save();
    return res.status(200).json({ success: true, message: 'Lock updated', data: { locked: doc.settings.availabilityLockedByHospital } });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Error', data: { error: e.message } });
  }
};

// @desc    Update doctor by hospital
// @route   PUT /api/doctors/:id/hospital-update
// @access  Private (Hospital only)
exports.updateDoctorByHospital = async (req, res) => {
  try {
    const { id } = req.params; // Doctor ID
    const { name, email, phoneNumber, profileImage, ...doctorBody } = req.body; // Extract user fields and doctor fields

    // 1. Validate doctorId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid doctor ID',
        data: null
      });
    }

    // 2. Find the Doctor and populate user and hospital
    const doctor = await Doctor.findById(id)
      .populate('user', 'name email phoneNumber profileImage')
      .populate('hospital', 'name');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        data: null
      });
    }

    // 3. Check Authorization
    if (req.user.role !== 'hospital') {
      return res.status(403).json({
        success: false,
        message: 'Only hospital users can update doctor profiles via this route',
        data: null
      });
    }

    if (!req.user.hospital || doctor.hospital._id.toString() !== req.user.hospital.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this doctor profile (hospital mismatch)',
        data: null
      });
    }

    // 4. Update Doctor fields (only allowed fields)
    const allowedDoctorFields = [
      'licenseNumber',
      'specialization',
      'consultationFee',
      'experience',
      'bio',
      'languages',
      'consultationModes',
      'availability',
      'isActive',
      'department',
    ];
    allowedDoctorFields.forEach(field => {
      if (doctorBody[field] !== undefined) {
        doctor[field] = doctorBody[field];
      }
    });

    // 5. Update User fields (if provided and doctor has a user account)
    if (doctor.user) {
      const userUpdateFields = {};
      if (name !== undefined) userUpdateFields.name = name;
      if (email !== undefined) userUpdateFields.email = email;
      if (phoneNumber !== undefined) userUpdateFields.phoneNumber = phoneNumber;
      if (profileImage !== undefined) userUpdateFields.profileImage = profileImage;

      if (Object.keys(userUpdateFields).length > 0) {
        // Prevent changing email to an already existing one (if provided and different)
        if (userUpdateFields.email && userUpdateFields.email !== doctor.user.email) {
          const existingUser = await User.findOne({ email: userUpdateFields.email });
          if (existingUser && existingUser._id.toString() !== doctor.user._id.toString()) {
            return res.status(400).json({
              success: false,
              message: 'Email already in use by another user',
              data: null
            });
          }
        }
        await User.findByIdAndUpdate(doctor.user._id, userUpdateFields, { new: true, runValidators: true });
      }
    }

    // 6. Save changes to the doctor document
    await doctor.save();

    // Re-populate to get the updated user data in the response
    const updatedDoctor = await Doctor.findById(id)
      .populate('user', 'name email phoneNumber profileImage')
      .populate('hospital', 'name location')
      .populate('department', 'name');

    // 7. Respond
    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully by hospital',
      data: { doctor: updatedDoctor }
    });

  } catch (error) {
    console.error('Error updating doctor by hospital:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating doctor profile',
      data: { error: error.message }
    });
  }
};