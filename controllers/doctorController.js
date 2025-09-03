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
    if (hospital) filter.hospital = hospital;
    if (department) filter.department = department;
    if (specialization) filter.specialization = specialization;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const doctors = await Doctor.find(filter)
      .populate('user', 'fullName email phoneNumber')
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
      .populate('user', 'fullName email phoneNumber')
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
// @access  Private (Admin only)
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

    if (user.role !== 'doctor') {
      return res.status(400).json({
        success: false,
        message: 'User must have doctor role',
        data: null
      });
    }

    // Verify hospital and department exist
    const hospital = await Hospital.findById(req.body.hospital);
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

    const doctor = await Doctor.create(req.body);
    await doctor.populate([
      { path: 'user', select: 'fullName email phoneNumber' },
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
      { path: 'user', select: 'fullName email phoneNumber' },
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
    .populate('user', 'fullName email phoneNumber')
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
      .populate('user', 'fullName email phoneNumber')
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