const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const { sendRoleChangeEmail, sendHospitalApprovalEmail } = require('../services/emailService');
const { createNotification } = require('../utils/notificationService'); // Import notification service

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, hospitalId } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;
    
    // If hospitalId is provided, find users associated with that hospital
    if (hospitalId) {
      if (role === 'doctor') {
        const doctors = await Doctor.find({ hospital: hospitalId }).select('user');
        filter._id = { $in: doctors.map(d => d.user) };
      } else if (role === 'hospital') {
        filter._id = { $in: await Hospital.find({ _id: hospitalId }).select('userId') };
      }
    }

    const users = await User.find(filter)
      .select('-password -otpCode -passwordResetOTP')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      data: null
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin or user themselves)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -otpCode -passwordResetOTP');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'admin';
    const isOwner = req.user._id.toString() === req.params.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user',
        data: null
      });
    }

    // Get additional info based on role
    let additionalInfo = {};
    if (user.role === 'doctor') {
      additionalInfo = await Doctor.findOne({ user: user._id })
        .populate('hospital', 'name location')
        .populate('department', 'name');
    } else if (user.role === 'hospital') {
      additionalInfo = await Hospital.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user,
        additionalInfo
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
      data: null
    });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!['patient', 'doctor', 'admin', 'hospital'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
        data: null
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    // Send role change notification email
    try {
      await sendRoleChangeEmail(user, oldRole, role);
      // Create notification for the user
      await createNotification({
        recipient: user._id,
        sender: req.user._id, // Admin who changed the role
        type: 'user',
        message: `Your role has been changed from ${oldRole} to ${role}.`,
        relatedEntity: { id: user._id, type: 'User' },
      });
    } catch (emailError) {
      console.error('Failed to send role change email/notification:', emailError);
    }

    res.status(200).json({
      success: true,
      message: `User role updated from ${oldRole} to ${role}`,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      data: null
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id/profile or PATCH /api/users/profile
// @access  Private (User themselves)
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    
    // Check if user is updating their own profile
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
        data: null
      });
    }

    const { name, email, phone, avatar, address, dateOfBirth, gender, bloodType, emergencyContact, specialization, experience, bio, consultationFee } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (avatar) updateData.profileImage = avatar;
    if (address) updateData.address = address;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (gender) updateData.gender = gender;
    if (bloodType) updateData.bloodType = bloodType;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (specialization) updateData.specialization = specialization;
    if (experience) updateData.experience = experience;
    if (bio) updateData.bio = bio;
    if (consultationFee) updateData.consultationFee = consultationFee;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -otpCode -passwordResetOTP');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists',
        data: null
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      data: null
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }

    // Deactivate instead of delete to preserve data integrity
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      data: null
    });
  }
};

// @desc    Get all patients
// @route   GET /api/users/patients
// @access  Private (Hospital, Admin)
exports.getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const patients = await User.find({ role: 'patient' })
      .select('-password -otpCode -passwordResetOTP')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({ role: 'patient' });

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
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patients',
      data: null
    });
  }
};