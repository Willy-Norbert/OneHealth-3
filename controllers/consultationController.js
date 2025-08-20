
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
