
const ConsultationType = require('../models/ConsultationType');
const Insurance = require('../models/Insurance');
const Teleconsultation = require('../models/Teleconsultation');

exports.getConsultationTypes = async (req, res) => {
  try {
    const consultationTypes = await ConsultationType.find({ isActive: true });
    res.status(200).json({
      status: 'success',
      data: { consultationTypes }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getInsuranceOptions = async (req, res) => {
  try {
    const insuranceOptions = await Insurance.find({ isActive: true });
    res.status(200).json({
      status: 'success',
      data: { insuranceOptions }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.createTeleconsultation = async (req, res) => {
  try {
    const teleconsultation = await Teleconsultation.create({
      ...req.body,
      patient: req.user._id
    });
    
    await teleconsultation.populate(['hospital', 'consultationType', 'insurance']);
    
    res.status(201).json({
      status: 'success',
      data: { teleconsultation }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.getUserTeleconsultations = async (req, res) => {
  try {
    const teleconsultations = await Teleconsultation.find({ patient: req.user._id })
      .populate(['hospital', 'consultationType', 'insurance'])
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: { teleconsultations }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateTeleconsultationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const teleconsultation = await Teleconsultation.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate(['hospital', 'consultationType', 'insurance']);
    
    if (!teleconsultation) {
      return res.status(404).json({
        status: 'error',
        message: 'Teleconsultation not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { teleconsultation }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get single teleconsultation
// @route   GET /api/teleconsultation/:id
// @access  Private (Patient/Doctor/Admin)
exports.getTeleconsultation = async (req, res) => {
  try {
    const teleconsultation = await Teleconsultation.findById(req.params.id)
      .populate(['hospital', 'consultationType', 'insurance', 'patient']);
    
    if (!teleconsultation) {
      return res.status(404).json({
        status: 'error',
        message: 'Teleconsultation not found'
      });
    }
    
    // Check permissions
    const isPatient = req.user._id.toString() === teleconsultation.patient._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isDoctor = req.user.role === 'doctor';
    
    if (!isPatient && !isAdmin && !isDoctor) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this consultation'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: { teleconsultation }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// @desc    Get doctor's teleconsultations
// @route   GET /api/doctors/:doctorId/consultations
// @access  Private (Doctor/Admin)
exports.getDoctorTeleconsultations = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    // Check permissions
    const isOwnProfile = req.user._id.toString() === doctorId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwnProfile && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view these consultations'
      });
    }
    
    // For doctors, we need to find consultations based on hospital/department
    // This is a simplified approach - in reality you'd have a doctorId field
    const teleconsultations = await Teleconsultation.find({})
      .populate(['hospital', 'consultationType', 'insurance', 'patient'])
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      data: { teleconsultations }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
