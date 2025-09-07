const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Department = require('../models/Department');

// @desc    Get all doctors with filtering and pagination
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { hospital, department, specialization, isActive } = req.query;
    
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

    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phoneNumber')
      .populate('hospital', 'name location')
      .populate('department', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

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