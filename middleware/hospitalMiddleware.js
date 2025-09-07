const Hospital = require('../models/Hospital');
const User = require('../models/User');

/**
 * Middleware to get hospital ID for hospital-role users
 * Adds req.hospitalId for hospital-role users
 */
const getHospitalId = async (req, res, next) => {
  try {
    console.log('=== HOSPITAL MIDDLEWARE: getHospitalId ===');
    console.log('User Role:', req.user?.role);
    console.log('User ID:', req.user?._id);
    console.log('User Hospital ID (from req.user.hospital):', req.user?.hospital);

    if (req.user?.role === 'hospital') {
      // Find hospital by the hospital ID stored in the user document
      const hospital = await Hospital.findById(req.user.hospital);
      
      if (!hospital) {
        console.log('❌ getHospitalId: Hospital profile not found for user hospital ID:', req.user.hospital);
        return res.status(403).json({
          success: false,
          message: 'Hospital profile not found. Please contact administrator.',
          data: null
        });
      }
      
      req.hospitalId = hospital._id;
      req.hospitalDoc = hospital;
      console.log('✅ getHospitalId: Hospital found. req.hospitalId:', req.hospitalId);
    }
    
    next();
  } catch (error) {
    console.error('❌ Hospital middleware error in getHospitalId:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving hospital information in getHospitalId',
      data: null
    });
  }
};

/**
 * Middleware to ensure bidirectional user-hospital linking
 */
const ensureHospitalLink = async (req, res, next) => {
  try {
    console.log('=== HOSPITAL MIDDLEWARE: ensureHospitalLink ===');
    console.log('ensureHospitalLink: User Role:', req.user?.role);
    console.log('ensureHospitalLink: req.hospitalDoc exists:', !!req.hospitalDoc);
    console.log('ensureHospitalLink: req.user.hospital before update:', req.user?.hospital);

    if (req.user?.role === 'hospital' && req.hospitalDoc) {
      // Update user's hospital field if not set
      if (!req.user.hospital || req.user.hospital.toString() !== req.hospitalDoc._id.toString()) {
        console.log('ensureHospitalLink: Updating user hospital ID to:', req.hospitalDoc._id);
        await User.findByIdAndUpdate(req.user._id, { 
          hospital: req.hospitalDoc._id 
        });
        // Update req.user.hospital for current request
        req.user.hospital = req.hospitalDoc._id; 
        console.log('ensureHospitalLink: User hospital ID updated.');
      }
    }
    console.log('ensureHospitalLink: req.user.hospital after update:', req.user?.hospital);
    
    next();
  } catch (error) {
    console.error('❌ Hospital link middleware error in ensureHospitalLink:', error);
    // Don't fail the request for this
    next();
  }
};

module.exports = { getHospitalId, ensureHospitalLink };