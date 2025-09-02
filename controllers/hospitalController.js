const Hospital = require('../models/Hospital');
const { sendHospitalApprovalEmail } = require('../services/emailService');

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
      updateData,
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
    const hospital = await Hospital.findById(req.params.id)
      .populate('userId', 'name email role')
      .populate('departments', 'name description consultationFee');

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    // Check permissions for non-approved hospitals
    if (!hospital.isApproved && req.user?.role !== 'admin') {
      const isHospitalOwner = req.user?.role === 'hospital' && 
                              hospital.userId && 
                              hospital.userId.toString() === req.user._id.toString();
      if (!isHospitalOwner) {
        return res.status(403).json({
          success: false,
          message: 'Hospital not approved or not authorized',
          data: null
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Hospital retrieved successfully',
      data: { hospital }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve hospital',
      data: null
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
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
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
