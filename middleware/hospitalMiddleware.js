const Hospital = require('../models/Hospital');
const User = require('../models/User');

/**
 * Middleware to get hospital ID for hospital-role users
 * Adds req.hospitalId for hospital-role users
 */
const getHospitalId = async (req, res, next) => {
  try {
    if (req.user?.role === 'hospital') {
      // Find hospital by userId
      const hospital = await Hospital.findOne({ userId: req.user._id });
      
      if (!hospital) {
        return res.status(403).json({
          success: false,
          message: 'Hospital profile not found. Please contact administrator.',
          data: null
        });
      }
      
      req.hospitalId = hospital._id;
      req.hospitalDoc = hospital;
    }
    
    next();
  } catch (error) {
    console.error('Hospital middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving hospital information',
      data: null
    });
  }
};

/**
 * Middleware to ensure bidirectional user-hospital linking
 */
const ensureHospitalLink = async (req, res, next) => {
  try {
    if (req.user?.role === 'hospital' && req.hospitalDoc) {
      // Update user's hospital field if not set
      if (!req.user.hospital) {
        await User.findByIdAndUpdate(req.user._id, { 
          hospital: req.hospitalDoc._id 
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Hospital link middleware error:', error);
    // Don't fail the request for this
    next();
  }
};

module.exports = { getHospitalId, ensureHospitalLink };