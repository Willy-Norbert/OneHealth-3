const LabResult = require('../models/LabResult');
const LabOrder = require('../models/LabOrder');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const { catchAsync } = require('../middleware/errorHandler');
const { logger, logAuditEvent } = require('../utils/logger');
const { sendEmail } = require('../services/emailService');

// Get all lab results with filtering
const getAllLabResults = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    patient, 
    doctor, 
    hospital, 
    testType, 
    status, 
    overallStatus,
    startDate,
    endDate,
    sortBy = 'reportedDate',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (patient) filter.patient = patient;
  if (doctor) filter.doctor = doctor;
  if (hospital) filter.hospital = hospital;
  if (testType) filter.testType = testType;
  if (status) filter.status = status;
  if (overallStatus) filter.overallStatus = overallStatus;
  
  if (startDate || endDate) {
    filter.reportedDate = {};
    if (startDate) filter.reportedDate.$gte = new Date(startDate);
    if (endDate) filter.reportedDate.$lte = new Date(endDate);
  }

  // Role-based filtering
  if (req.user.role === 'hospital') {
    filter.hospital = req.user.hospital;
  } else if (req.user.role === 'doctor') {
    filter.doctor = req.user._id;
  } else if (req.user.role === 'patient') {
    filter.patient = req.user._id;
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: [
      { path: 'patient', select: 'user patientId', populate: { path: 'user', select: 'name email' } },
      { path: 'doctor', select: 'name specialization' },
      { path: 'hospital', select: 'name location' },
      { path: 'verifiedBy', select: 'name' }
    ]
  };

  const results = await LabResult.paginate(filter, options);

  logAuditEvent('lab_results_accessed', req.user._id, { 
    filter: Object.keys(filter),
    count: results.totalDocs 
  });

  res.status(200).json({
    status: 'success',
    data: results
  });
});

// Get lab result by ID
const getLabResult = catchAsync(async (req, res) => {
  const { id } = req.params;

  const labResult = await LabResult.findById(id)
    .populate('patient', 'user patientId')
    .populate('patient.user', 'name email')
    .populate('doctor', 'name specialization')
    .populate('hospital', 'name location')
    .populate('verifiedBy', 'name')
    .populate('labOrder');

  if (!labResult) {
    return res.status(404).json({
      status: 'error',
      message: 'Lab result not found'
    });
  }

  // Check access permissions
  if (req.user.role === 'patient' && labResult.patient._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to this lab result'
    });
  }

  if (req.user.role === 'doctor' && labResult.doctor._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to this lab result'
    });
  }

  if (req.user.role === 'hospital' && labResult.hospital._id.toString() !== req.user.hospital.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to this lab result'
    });
  }

  logAuditEvent('lab_result_accessed', req.user._id, { labResultId: id });

  res.status(200).json({
    status: 'success',
    data: labResult
  });
});

// Create new lab result
const createLabResult = catchAsync(async (req, res) => {
  const labResultData = {
    ...req.body,
    createdBy: req.user._id
  };

  // Validate required fields
  if (!labResultData.patient || !labResultData.doctor || !labResultData.hospital) {
    return res.status(400).json({
      status: 'error',
      message: 'Patient, doctor, and hospital are required'
    });
  }

  // Check if patient exists
  const patient = await Patient.findById(labResultData.patient);
  if (!patient) {
    return res.status(404).json({
      status: 'error',
      message: 'Patient not found'
    });
  }

  // Check if doctor exists
  const doctor = await Doctor.findById(labResultData.doctor);
  if (!doctor) {
    return res.status(404).json({
      status: 'error',
      message: 'Doctor not found'
    });
  }

  // Check if hospital exists
  const hospital = await Hospital.findById(labResultData.hospital);
  if (!hospital) {
    return res.status(404).json({
      status: 'error',
      message: 'Hospital not found'
    });
  }

  const labResult = await LabResult.create(labResultData);

  // Populate the created lab result
  await labResult.populate([
    { path: 'patient', select: 'user patientId', populate: { path: 'user', select: 'name email' } },
    { path: 'doctor', select: 'name specialization' },
    { path: 'hospital', select: 'name location' }
  ]);

  logAuditEvent('lab_result_created', req.user._id, { 
    labResultId: labResult._id,
    patientId: labResult.patient._id,
    testType: labResult.testType
  });

  res.status(201).json({
    status: 'success',
    data: labResult
  });
});

// Update lab result
const updateLabResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const labResult = await LabResult.findById(id);
  if (!labResult) {
    return res.status(404).json({
      status: 'error',
      message: 'Lab result not found'
    });
  }

  // Check access permissions
  if (req.user.role === 'patient') {
    return res.status(403).json({
      status: 'error',
      message: 'Patients cannot update lab results'
    });
  }

  if (req.user.role === 'doctor' && labResult.doctor.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to this lab result'
    });
  }

  if (req.user.role === 'hospital' && labResult.hospital.toString() !== req.user.hospital.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to this lab result'
    });
  }

  // Update the lab result
  const updatedLabResult = await LabResult.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate([
    { path: 'patient', select: 'user patientId', populate: { path: 'user', select: 'name email' } },
    { path: 'doctor', select: 'name specialization' },
    { path: 'hospital', select: 'name location' },
    { path: 'verifiedBy', select: 'name' }
  ]);

  logAuditEvent('lab_result_updated', req.user._id, { 
    labResultId: id,
    updatedFields: Object.keys(updateData)
  });

  res.status(200).json({
    status: 'success',
    data: updatedLabResult
  });
});

// Verify lab result
const verifyLabResult = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;

  const labResult = await LabResult.findById(id);
  if (!labResult) {
    return res.status(404).json({
      status: 'error',
      message: 'Lab result not found'
    });
  }

  // Only doctors and admins can verify lab results
  if (!['doctor', 'admin'].includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      message: 'Only doctors and admins can verify lab results'
    });
  }

  // Update verification
  labResult.verifiedBy = req.user._id;
  labResult.verifiedAt = new Date();
  labResult.comments = comments;
  labResult.status = 'completed';

  await labResult.save();

  // Populate the verified lab result
  await labResult.populate([
    { path: 'patient', select: 'user patientId', populate: { path: 'user', select: 'name email' } },
    { path: 'doctor', select: 'name specialization' },
    { path: 'hospital', select: 'name location' },
    { path: 'verifiedBy', select: 'name' }
  ]);

  // Send notification to patient if critical results
  if (labResult.overallStatus === 'critical') {
    try {
      await sendEmail({
        to: labResult.patient.user.email,
        subject: 'Urgent Lab Results Available',
        html: `
          <h2>Urgent Lab Results</h2>
          <p>Dear ${labResult.patient.user.name},</p>
          <p>Your recent lab results require immediate attention. Please contact your doctor as soon as possible.</p>
          <p><strong>Test:</strong> ${labResult.testName}</p>
          <p><strong>Status:</strong> ${labResult.overallStatus}</p>
          <p>Please log into your account to view the complete results.</p>
        `
      });
    } catch (error) {
      logger.error('Failed to send critical lab result notification', error);
    }
  }

  logAuditEvent('lab_result_verified', req.user._id, { 
    labResultId: id,
    overallStatus: labResult.overallStatus
  });

  res.status(200).json({
    status: 'success',
    data: labResult
  });
});

// Get critical lab results
const getCriticalLabResults = catchAsync(async (req, res) => {
  const criticalResults = await LabResult.findCriticalResults();

  // Filter by user role
  let filteredResults = criticalResults;
  
  if (req.user.role === 'hospital') {
    filteredResults = criticalResults.filter(result => 
      result.hospital._id.toString() === req.user.hospital.toString()
    );
  } else if (req.user.role === 'doctor') {
    filteredResults = criticalResults.filter(result => 
      result.doctor._id.toString() === req.user._id.toString()
    );
  }

  logAuditEvent('critical_lab_results_accessed', req.user._id, { 
    count: filteredResults.length 
  });

  res.status(200).json({
    status: 'success',
    data: filteredResults
  });
});

// Get lab statistics
const getLabStatistics = catchAsync(async (req, res) => {
  const { hospitalId, startDate, endDate } = req.query;
  
  const dateRange = {
    start: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: endDate ? new Date(endDate) : new Date()
  };

  let targetHospitalId = hospitalId;
  
  // Role-based filtering
  if (req.user.role === 'hospital') {
    targetHospitalId = req.user.hospital;
  }

  const statistics = await LabResult.getLabStatistics(targetHospitalId, dateRange);

  logAuditEvent('lab_statistics_accessed', req.user._id, { 
    hospitalId: targetHospitalId,
    dateRange 
  });

  res.status(200).json({
    status: 'success',
    data: {
      period: dateRange,
      statistics
    }
  });
});

// Delete lab result (soft delete)
const deleteLabResult = catchAsync(async (req, res) => {
  const { id } = req.params;

  const labResult = await LabResult.findById(id);
  if (!labResult) {
    return res.status(404).json({
      status: 'error',
      message: 'Lab result not found'
    });
  }

  // Only admins and the creating doctor can delete
  if (req.user.role !== 'admin' && labResult.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to delete this lab result'
    });
  }

  // Soft delete
  labResult.isActive = false;
  await labResult.save();

  logAuditEvent('lab_result_deleted', req.user._id, { labResultId: id });

  res.status(200).json({
    status: 'success',
    message: 'Lab result deleted successfully'
  });
});

module.exports = {
  getAllLabResults,
  getLabResult,
  createLabResult,
  updateLabResult,
  verifyLabResult,
  getCriticalLabResults,
  getLabStatistics,
  deleteLabResult
};

































