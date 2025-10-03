const Emergency = require('../models/Emergency');
const { sendEmergencyStatusEmail } = require('../services/emailService');
const { createNotification } = require('../utils/notificationService'); // Import notification service
const Hospital = require('../models/Hospital'); // Import Hospital model

// @desc    Create emergency request
// @route   POST /api/emergencies
// @access  Private (Patient only)
exports.createEmergency = async (req, res) => {
  try {
    const emergencyData = {
      ...req.body,
      patient: req.user._id
    };

    const emergency = await Emergency.create(emergencyData);
    await emergency.populate('patient', 'fullName phoneNumber');

    // Here you would typically trigger emergency response workflow
    // - Send notifications to emergency responders
    // - Alert nearby hospitals
    // - Dispatch ambulance if needed

    // Create notification for the patient
    await createNotification({
      recipient: req.user._id,
      type: 'emergency',
      message: 'Your emergency request has been created successfully. Help is on the way!',
      relatedEntity: { id: emergency._id, type: 'Emergency' },
    });

    res.status(201).json({
      success: true,
      message: 'Emergency request created successfully. Help is on the way!',
      data: { emergency }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating emergency request',
      data: { error: error.message }
    });
  }
};

// @desc    Get all emergencies
// @route   GET /api/emergencies
// @access  Private (Admin/Emergency responders only)
exports.getAllEmergencies = async (req, res) => {
  try {
    console.log('=== GET ALL EMERGENCIES ===');
    console.log('User accessing emergencies:', req.user.role, req.user._id);
    console.log('User hospital ID:', req.user.hospital);

    const { page = 1, limit = 10, status, emergencyType, severity } = req.query;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (status) filter.status = status;
    if (emergencyType) filter.emergencyType = emergencyType;
    if (severity) filter.severity = severity;

    // Hospital role can only see emergencies assigned to their hospital
    if (req.user.role === 'hospital') {
      filter['assignedTo.hospital'] = req.user.hospital;
      console.log('Hospital filter applied to emergencies:', filter);
    }

    const emergencies = await Emergency.find(filter)
      .populate('patient', 'fullName phoneNumber')
      .populate('assignedTo.responder', 'fullName phoneNumber role')
      .populate('assignedTo.hospital', 'name location contact')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    console.log('Emergencies found with filter:', filter, 'Count:', emergencies.length);

    const total = await Emergency.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Emergencies retrieved successfully',
      data: { 
        emergencies, 
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalEmergencies: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllEmergencies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve emergencies',
      data: null
    });
  }
};

// @desc    Get single emergency
// @route   GET /api/emergencies/:id
// @access  Private (Patient/Admin/Responder)
exports.getEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('patient', 'fullName phoneNumber email')
      .populate('assignedTo.responder', 'fullName phoneNumber role')
      .populate('assignedTo.hospital', 'name location contact');

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found',
        data: null
      });
    }

    // Check permissions
    const isPatient = req.user._id.toString() === emergency.patient._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isAssignedResponder = emergency.assignedTo?.responder && 
      emergency.assignedTo.responder._id.toString() === req.user._id.toString();

    if (!isPatient && !isAdmin && !isAssignedResponder) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this emergency',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Emergency retrieved successfully',
      data: { emergency }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving emergency',
      data: { error: error.message }
    });
  }
};

// @desc    Update emergency status
// @route   PUT /api/emergencies/:id/status
// @access  Private (Admin/Responder only)
exports.updateEmergencyStatus = async (req, res) => {
  try {
    const { status, notes, estimatedArrival } = req.body;

    const updateData = { 
      status,
      $push: {
        statusHistory: {
          status,
          notes,
          updatedBy: req.user._id,
          timestamp: new Date()
        }
      }
    };

    if (estimatedArrival) {
      updateData['assignedTo.estimatedArrival'] = estimatedArrival;
    }

    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient', select: 'fullName phoneNumber' },
      { path: 'assignedTo.responder', select: 'fullName phoneNumber' },
      { path: 'assignedTo.hospital', select: 'name location' }
    ]);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found',
        data: null
      });
    }

    // Send status update email
    try {
      await sendEmergencyStatusEmail(emergency, status);
      // Create notification for the patient
      await createNotification({
        recipient: emergency.patient._id,
        sender: req.user._id,
        type: 'emergency',
        message: `Your emergency request status has been updated to ${status}.`,
        relatedEntity: { id: emergency._id, type: 'Emergency' },
      });
      // If an responder is assigned, notify them too
      if (emergency.assignedTo?.responder) {
        await createNotification({
          recipient: emergency.assignedTo.responder._id,
          sender: req.user._id,
          type: 'emergency',
          message: `Emergency ID ${emergency._id} status updated to ${status}.`,
          relatedEntity: { id: emergency._id, type: 'Emergency' },
        });
      }
    } catch (error) {
      console.error('Email/Notification send error:', error.message);
    }

    res.status(200).json({
      success: true,
      message: 'Emergency status updated successfully',
      data: { emergency }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating emergency status',
      data: { error: error.message }
    });
  }
};

// @desc    Assign responder to emergency
// @route   PUT /api/emergencies/:id/assign
// @access  Private (Admin only)
exports.assignResponder = async (req, res) => {
  try {
    const { responder, hospital, ambulanceId, estimatedArrival } = req.body;

    const emergency = await Emergency.findByIdAndUpdate(
      req.params.id,
      {
        'assignedTo.responder': responder,
        'assignedTo.hospital': hospital,
        'assignedTo.ambulanceId': ambulanceId,
        'assignedTo.estimatedArrival': estimatedArrival,
        status: 'acknowledged'
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient', select: 'fullName phoneNumber' },
      { path: 'assignedTo.responder', select: 'fullName phoneNumber' },
      { path: 'assignedTo.hospital', select: 'name location contact' }
    ]);

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found',
        data: null
      });
    }

    // Create notification for the patient and assigned responder
    await createNotification({
      recipient: emergency.patient._id,
      sender: req.user._id,
      type: 'emergency',
      message: `Your emergency request has been acknowledged and a responder has been assigned. Estimated arrival: ${emergency.assignedTo.estimatedArrival}.`,
      relatedEntity: { id: emergency._id, type: 'Emergency' },
    });
    if (emergency.assignedTo?.responder) {
      await createNotification({
        recipient: emergency.assignedTo.responder._id,
        sender: req.user._id,
        type: 'emergency',
        message: `You have been assigned to an emergency request from ${emergency.patient.fullName}. Estimated arrival: ${emergency.assignedTo.estimatedArrival}.`,
        relatedEntity: { id: emergency._id, type: 'Emergency' },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Responder assigned successfully',
      data: { emergency }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error assigning responder',
      data: { error: error.message }
    });
  }
};

// @desc    Get patient's emergency history
// @route   GET /api/patients/:patientId/emergencies
// @access  Private (Patient themselves or admin)
exports.getPatientEmergencies = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check permissions
    const isPatient = req.user._id.toString() === patientId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these emergencies',
        data: null
      });
    }

    const emergencies = await Emergency.find({ patient: patientId })
      .populate('assignedTo.responder', 'fullName')
      .populate('assignedTo.hospital', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Patient emergencies retrieved successfully',
      data: { emergencies, count: emergencies.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient emergencies',
      data: { error: error.message }
    });
  }
};

// @desc    Get emergencies near location
// @route   GET /api/emergencies/near
// @access  Private (Emergency responders/Admin only)
exports.getEmergenciesNear = async (req, res) => {
  try {
    const { lat, lng, radius = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        data: null
      });
    }

    const emergencies = await Emergency.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // convert km to meters
        }
      },
      status: { $in: ['pending', 'acknowledged', 'help-on-way'] }
    }).populate('patient', 'fullName phoneNumber');

    res.status(200).json({
      success: true,
      message: 'Nearby emergencies retrieved successfully',
      data: { emergencies, count: emergencies.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving nearby emergencies',
      data: { error: error.message }
    });
  }
};