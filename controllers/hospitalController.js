const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');
const User = require('../models/User'); // Import User model
const { sendHospitalApprovalEmail, sendWelcomeEmail } = require('../services/emailService');
const { createNotification } = require('../utils/notificationService'); // Import notification service

// Get all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const { page = 1, limit = 10, approved } = req.query;
    const skip = (page - 1) * limit;

    let filter = { isActive: true };

    // Debugging logs
    console.log("===== Fetching Hospitals =====");
    console.log("Query Params:", req.query);
    console.log("User Info:", req.user ? { id: req.user._id, role: req.user.role } : "No user");

    // If user is hospital role, only show their own hospital
    if (req.user?.role === 'hospital') {
      filter.userId = req.user._id;
    }

    // Admin can filter by approval status
    if (req.user?.role === 'admin' && approved !== undefined) {
      filter.isApproved = approved === 'true';
    } else if (!req.user || req.user.role !== 'admin') {
      // Non-admin users only see approved hospitals
      filter.isApproved = true;
    }

    console.log("Applied Filter:", filter);

    const hospitals = await Hospital.find(filter)
      .populate('userId', 'name email role')
      .populate('departments', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Hospital.countDocuments(filter);

    console.log("Hospitals Fetched:", hospitals.length, "/", total);

    res.status(200).json({
      success: true,
      message: 'Hospitals retrieved successfully',
      data: {
        hospitals,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalHospitals: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hospitals',
      data: null
    });
  }
};


// Create hospital
exports.createHospital = async (req, res) => {
  try {
    const hospitalData = { ...req.body };

    // Only admin can create hospitals with approval
    if (req.user?.role === 'admin') {
      hospitalData.isApproved = hospitalData.isApproved !== undefined ? hospitalData.isApproved : true;
    } else if (req.user?.role === 'hospital') {
      // Hospital users creating their own profile
      hospitalData.userId = req.user._id;
      hospitalData.isApproved = false; // Requires admin approval
    } else {
      return res.status(403).json({
        success: false,
        message: 'Only Admin or Hospital role can create hospitals',
        data: null
      });
    }

    const hospital = await Hospital.create(hospitalData);
    await hospital.populate('userId', 'name email role');

    res.status(201).json({
      success: true,
      message: 'Hospital created successfully',
      data: { hospital }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Update hospital
exports.updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id).populate('userId', 'name email role'); // Populate userId

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    // Check permissions
    const isAdmin = req.user?.role === 'admin';
    const isHospitalOwner = req.user?.role === 'hospital' && 
                            hospital.userId && 
                            hospital.userId._id.toString() === req.user._id.toString();
    
    console.log(`Debug updateHospital - req.user._id (obj): ${req.user?._id}, req.user._id (str): ${req.user?._id.toString()}`);
    console.log(`Debug updateHospital - req.user.hospital: ${req.user?.hospital}, req.user.role: ${req.user?.role}`);
    console.log(`Debug updateHospital - req.params.id (str): ${req.params.id}`);
    console.log(`Debug updateHospital - hospital.userId (obj): ${hospital.userId}, hospital.userId (str): ${hospital.userId?._id.toString()}`);
    console.log(`Debug updateHospital - isAdmin: ${isAdmin}, isHospitalOwner: ${isHospitalOwner}`);
    console.log(`Debug updateHospital - Comparison result (hospital.userId === req.user._id): ${hospital.userId?._id.toString() === req.user._id.toString()}`);

    if (!isAdmin && !isHospitalOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hospital',
        data: null
      });
    }

    // Hospital users cannot change approval status or userId
    const updateData = { ...req.body };
    if (req.user?.role === 'hospital') {
      delete updateData.isApproved;
      delete updateData.userId;
    }

    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { 
        name: updateData.name,
        location: updateData.location,
        address: updateData.address,
        "contact.phone": updateData.contact?.phone,
        "contact.email": updateData.contact?.email,
        services: updateData.services,
        workingHours: updateData.workingHours,
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email role');

    res.status(200).json({
      success: true,
      message: 'Hospital updated successfully',
      data: { hospital: updatedHospital }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Delete (deactivate) hospital
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        data: null
      });
    }

    await Hospital.findByIdAndUpdate(req.params.id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Hospital deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// Get single hospital
exports.getHospital = async (req, res) => {
  try {
    console.log('=== GET HOSPITAL BY ID ===');
    console.log('Hospital ID:', req.params.id);
    console.log('User role:', req.user?.role || 'public');

    const { id } = req.params;
    
    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('❌ Invalid ObjectId format:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid hospital ID format',
        data: null
      });
    }

    const hospital = await Hospital.findById(id)
      .populate('userId', 'name email role')
      .populate('departments', 'name description consultationFee');

    if (!hospital) {
      console.log('❌ Hospital not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    console.log('✅ Hospital found:', hospital.name, 'Approved:', hospital.isApproved);
    console.log('Debug getHospital - hospital.userId after populate:', hospital.userId); // Added for debugging

    // For approved hospitals, allow public access
    if (hospital.isApproved) {
      return res.status(200).json({
        success: true,
        message: 'Hospital retrieved successfully',
        data: { hospital }
      });
    }

    // For non-approved hospitals, check permissions
    if (!req.user) {
      console.log('❌ Hospital not approved and no user authentication');
      return res.status(403).json({
        success: false,
        message: 'Hospital not approved for public access',
        data: null
      });
    }

    if (req.user.role === 'admin') {
      console.log('✅ Admin access granted');
      return res.status(200).json({
        success: true,
        message: 'Hospital retrieved successfully',
        data: { hospital }
      });
    }

    // Check if user is the hospital owner
    const isHospitalOwner = req.user.role === 'hospital' && 
                            hospital.userId && 
                            hospital.userId.toString() === req.user._id.toString();
    
    if (isHospitalOwner) {
      console.log('✅ Hospital owner access granted');
      return res.status(200).json({
        success: true,
        message: 'Hospital retrieved successfully',
        data: { hospital }
      });
    }

    console.log('❌ User not authorized to view this hospital');
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this hospital',
      data: null
    });

  } catch (error) {
    console.error('❌ Error in getHospital:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hospital',
      data: { error: error.message }
    });
  }
};

// Approve or reject hospital (Admin only)
exports.approveHospital = async (req, res) => {
  try {
    const { isApproved } = req.body;

    if (req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
        data: null
      });
    }

    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('userId', 'name email role');

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    // Send approval/rejection email
    if (hospital.userId) {
      try {
        await sendHospitalApprovalEmail(hospital.userId, hospital, isApproved);
        await createNotification({
          recipient: hospital.userId._id,
          sender: req.user._id,
          type: 'system',
          message: `Your hospital ${hospital.name} has been ${isApproved ? 'approved' : 'rejected'} by an admin.`,
          relatedEntity: { id: hospital._id, type: 'Hospital' },
        });
      } catch (emailError) {
        console.error('Failed to send approval email/notification:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      message: `Hospital ${isApproved ? 'approved' : 'rejected'} successfully`,
      data: { hospital }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get hospital's doctors
// @route   GET /api/hospitals/:id/doctors
// @access  Private (Hospital owner or Admin)
exports.getHospitalDoctors = async (req, res) => {
  try {
    console.log('=== GET HOSPITAL DOCTORS ===');
    console.log('Request User (getHospitalDoctors):', req.user); // Added for debugging
    console.log('Hospital ID from params (getHospitalDoctors):', req.params.id);
    console.log('User Hospital ID (getHospitalDoctors):', req.user?.hospital); // Added for debugging

    const hospital = await Hospital.findById(req.params.id);
    console.log('Found Hospital by params.id (getHospitalDoctors):', hospital ? hospital.name : 'Not Found'); // Added for debugging
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    // Check permissions
    const isAdmin = req.user?.role === 'admin';
    const isHospitalOwner = req.user?.role === 'hospital' && 
                            req.user.hospital && // Ensure req.user.hospital exists
                            req.params.id.toString() === req.user.hospital.toString();
    console.log(`Debug getHospitalDoctors - isAdmin: ${isAdmin}, isHospitalOwner: ${isHospitalOwner}`);
    console.log(`Debug getHospitalDoctors - req.params.id: ${req.params.id}, req.user.hospital: ${req.user.hospital}`);

    if (!isAdmin && !isHospitalOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this hospital\'s doctors',
        data: null
      });
    }

    const { page = 1, limit = 10, department } = req.query;
    const skip = (page - 1) * limit;

    const filter = { hospital: req.params.id, isActive: true };
    if (department) filter.department = department;
    console.log("Backend getHospitalDoctors: Applied filter:", filter);

    const Doctor = require('../models/Doctor');
    const doctors = await Doctor.find(filter)
      .populate('user', 'name email phone')
      .populate('department', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    console.log("Backend getHospitalDoctors: Doctors found before total count:", doctors.length);
    console.log("Backend getHospitalDoctors: Populated Doctors data (first entry):", doctors[0]); // Added for debugging
    const total = await Doctor.countDocuments(filter);

    console.log(`Found ${doctors.length} doctors for hospital`);

    res.status(200).json({
      success: true,
      message: 'Hospital doctors retrieved successfully',
      data: {
        doctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalDoctors: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getHospitalDoctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hospital doctors',
      data: null
    });
  }
};

// @desc    Create doctor for hospital
// @route   POST /api/hospitals/:id/doctors
// @access  Private (Hospital owner or Admin)
exports.createHospitalDoctor = async (req, res) => {
  try {
    console.log('=== CREATE HOSPITAL DOCTOR ===');
    console.log('Hospital ID:', req.params.id);
    console.log('Doctor data:', req.body);
    console.log('User:', req.user.role, req.user._id);

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    // Check permissions
    const isAdmin = req.user?.role === 'admin';
    const isHospitalOwner = req.user?.role === 'hospital' && 
                            hospital.userId && 
                            hospital.userId.toString() === req.user._id.toString();

    if (!isAdmin && !isHospitalOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create doctors for this hospital',
        data: null
      });
    }

    // Create user first if not provided
    let doctorUser;
    if (req.body.user) {
      // Use existing user
      const User = require('../models/User');
      doctorUser = await User.findById(req.body.user);
      if (!doctorUser) {
        return res.status(400).json({
          success: false,
          message: 'User not found',
          data: null
        });
      }
      if (doctorUser.role !== 'doctor' && doctorUser.role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'User must have doctor or admin role',
          data: null
        });
      }
    } else {
      // Create new user for doctor
      const User = require('../models/User');
      const { doctorInfo } = req.body;
      if (!doctorInfo || !doctorInfo.name || !doctorInfo.email || !doctorInfo.password) {
        return res.status(400).json({
          success: false,
          message: 'Doctor user information (name, email, password) is required',
          data: null
        });
      }

      doctorUser = await User.create({
        name: doctorInfo.name,
        email: doctorInfo.email,
        password: doctorInfo.password,
        role: 'doctor',
        isActive: true,
        isVerified: true,
        profileImage: doctorInfo.profileImage // Include profileImage if provided
      });
      console.log("Created doctor user:", doctorUser); // Add this line
      // Send welcome email with hospital name and credentials
      await sendWelcomeEmail(doctorUser, hospital.name, doctorInfo.password);
      // Create notification for the new doctor
      await createNotification({
        recipient: doctorUser._id,
        sender: req.user._id,
        type: 'user',
        message: `You have been registered as a doctor at ${hospital.name}. Your account is now active.`,
        relatedEntity: { id: doctorUser._id, type: 'User' },
      });
    }

    // Verify department belongs to this hospital
    const Department = require('../models/Department');
    const department = await Department.findById(req.body.department);
    if (!department || department.hospital.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Department must belong to the hospital',
        data: null
      });
    }

    // Create doctor profile
    const Doctor = require('../models/Doctor');
    const doctorData = {
      ...req.body,
      user: doctorUser._id,
      hospital: req.params.id
    };

    const doctor = await Doctor.create(doctorData);
    await doctor.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'hospital', select: 'name location' },
      { path: 'department', select: 'name' }
    ]);

    console.log('Doctor created successfully:', doctor._id);

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: { doctor }
    });
  } catch (error) {
    console.error('Error in createHospitalDoctor:', error);
    res.status(400).json({
      success: false,
      message: error.message,
      data: null
    });
  }
};

// @desc    Get hospital appointments
// @route   GET /api/hospitals/:id/appointments
// @access  Private (Hospital owner or Admin)
exports.getHospitalAppointments = async (req, res) => {
  try {
    console.log('=== GET HOSPITAL APPOINTMENTS ===');
    console.log('Hospital ID:', req.params.id);
    console.log('User:', req.user.role, req.user._id);

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    // Check permissions
    const isAdmin = req.user?.role === 'admin';
    const isHospitalOwner = req.user?.role === 'hospital' && 
                            req.params.id && 
                            req.params.id.toString() === req.user.hospital.toString();
    console.log(`Debug getHospitalAppointments - isAdmin: ${isAdmin}, isHospitalOwner: ${isHospitalOwner}`);
    console.log(`Debug getHospitalAppointments - req.params.id: ${req.params.id}, req.user.hospital: ${req.user.hospital}`);

    if (!isAdmin && !isHospitalOwner) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this hospital\'s appointments',
        data: null
      });
    }

    const { page = 1, limit = 10, status, date, department } = req.query;
    const skip = (page - 1) * limit;

    const filter = { hospital: req.params.id };
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (date) {
      const dateObj = new Date(date);
      dateObj.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.appointmentDate = { $gte: dateObj, $lt: nextDay };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'specialization')
      .populate('department', 'name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ appointmentDate: -1, appointmentTime: -1 });

    const total = await Appointment.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Hospital appointments retrieved successfully',
      data: {
        appointments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalAppointments: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getHospitalAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hospital appointments',
      data: null
    });
  }
};
