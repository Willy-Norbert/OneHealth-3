const express = require('express');
const { protect, restrictTo } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const { logger, logAuditEvent } = require('../utils/logger');

// Import models
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const Emergency = require('../models/Emergency');
const Order = require('../models/Order');
const MedicalRecord = require('../models/MedicalRecord');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Dashboard analytics for all roles
router.get('/dashboard', catchAsync(async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user._id;
  
  let analytics = {};
  
  switch (userRole) {
      case 'admin':
      analytics = await getAdminAnalytics();
      break;
      case 'hospital':
      analytics = await getHospitalAnalytics(userId);
      break;
      case 'doctor':
      analytics = await getDoctorAnalytics(userId);
      break;
      case 'patient':
      analytics = await getPatientAnalytics(userId);
      break;
      default:
        return res.status(403).json({
          status: 'error',
        message: 'Access denied'
      });
  }
  
  logAuditEvent('analytics_dashboard_accessed', userId, { role: userRole });
  
  res.status(200).json({
    status: 'success',
    data: analytics
  });
}));

// System-wide analytics (Admin only)
router.get('/system', restrictTo('admin'), catchAsync(async (req, res) => {
  const { period = '30d', startDate, endDate } = req.query;
  
  const dateFilter = buildDateFilter(period, startDate, endDate);
  
  const systemAnalytics = await Promise.all([
    getUserAnalytics(dateFilter),
    getHospitalAnalytics(dateFilter),
    getAppointmentAnalytics(dateFilter),
    getRevenueAnalytics(dateFilter),
    getSystemHealthMetrics(),
    getGeographicAnalytics(dateFilter),
    getPerformanceMetrics(dateFilter)
  ]);
  
  const analytics = {
    period,
    dateRange: dateFilter,
    users: systemAnalytics[0],
    hospitals: systemAnalytics[1],
    appointments: systemAnalytics[2],
    revenue: systemAnalytics[3],
    systemHealth: systemAnalytics[4],
    geographic: systemAnalytics[5],
    performance: systemAnalytics[6]
  };
  
  logAuditEvent('system_analytics_accessed', req.user._id, { period });
  
  res.status(200).json({
    status: 'success',
    data: analytics
  });
}));

// Hospital-specific analytics
router.get('/hospital/:hospitalId', restrictTo('admin', 'hospital'), catchAsync(async (req, res) => {
  const { hospitalId } = req.params;
  const { period = '30d' } = req.query;
  
  // Check if user has access to this hospital
  if (req.user.role === 'hospital' && req.user.hospital?.toString() !== hospitalId) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to this hospital data'
    });
  }
  
  const dateFilter = buildDateFilter(period);
  
  const hospitalAnalytics = await Promise.all([
    getHospitalStaffAnalytics(hospitalId, dateFilter),
    getHospitalAppointmentAnalytics(hospitalId, dateFilter),
    getHospitalRevenueAnalytics(hospitalId, dateFilter),
    getHospitalPatientAnalytics(hospitalId, dateFilter),
    getHospitalPerformanceMetrics(hospitalId, dateFilter)
  ]);
  
  const analytics = {
    hospitalId,
    period,
    dateRange: dateFilter,
    staff: hospitalAnalytics[0],
    appointments: hospitalAnalytics[1],
    revenue: hospitalAnalytics[2],
    patients: hospitalAnalytics[3],
    performance: hospitalAnalytics[4]
  };
  
  logAuditEvent('hospital_analytics_accessed', req.user._id, { hospitalId, period });
  
  res.status(200).json({
    status: 'success',
    data: analytics
  });
}));

// Doctor performance analytics
router.get('/doctor/:doctorId', restrictTo('admin', 'hospital', 'doctor'), catchAsync(async (req, res) => {
  const { doctorId } = req.params;
  const { period = '30d' } = req.query;
  
  // Check access permissions
  if (req.user.role === 'doctor' && req.user._id.toString() !== doctorId) {
    return res.status(403).json({
        status: 'error',
      message: 'Access denied to this doctor data'
    });
  }
  
  const dateFilter = buildDateFilter(period);
  
  const doctorAnalytics = await Promise.all([
    getDoctorAppointmentAnalytics(doctorId, dateFilter),
    getDoctorPatientAnalytics(doctorId, dateFilter),
    getDoctorPrescriptionAnalytics(doctorId, dateFilter),
    getDoctorPerformanceMetrics(doctorId, dateFilter)
  ]);
  
  const analytics = {
    doctorId,
    period,
    dateRange: dateFilter,
    appointments: doctorAnalytics[0],
    patients: doctorAnalytics[1],
    prescriptions: doctorAnalytics[2],
    performance: doctorAnalytics[3]
  };
  
  logAuditEvent('doctor_analytics_accessed', req.user._id, { doctorId, period });
  
  res.status(200).json({
    status: 'success',
    data: analytics
  });
}));

// Patient health analytics
router.get('/patient/:patientId', restrictTo('admin', 'hospital', 'doctor', 'patient'), catchAsync(async (req, res) => {
  const { patientId } = req.params;
  const { period = '1y' } = req.query;
  
  // Check access permissions
  if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({
        status: 'error',
      message: 'Access denied to this patient data'
    });
  }
  
  const dateFilter = buildDateFilter(period);
  
  const patientAnalytics = await Promise.all([
    getPatientHealthAnalytics(patientId, dateFilter),
    getPatientAppointmentHistory(patientId, dateFilter),
    getPatientMedicationHistory(patientId, dateFilter),
    getPatientHealthTrends(patientId, dateFilter)
  ]);
  
  const analytics = {
    patientId,
    period,
    dateRange: dateFilter,
    health: patientAnalytics[0],
    appointments: patientAnalytics[1],
    medications: patientAnalytics[2],
    trends: patientAnalytics[3]
  };
  
  logAuditEvent('patient_analytics_accessed', req.user._id, { patientId, period });
  
  res.status(200).json({
    status: 'success',
    data: analytics
  });
}));

// Real-time analytics
router.get('/realtime', restrictTo('admin', 'hospital'), catchAsync(async (req, res) => {
  const realtimeAnalytics = await Promise.all([
    getActiveUsers(),
    getActiveAppointments(),
    getSystemLoad(),
    getRecentActivities()
  ]);
  
  const analytics = {
    timestamp: new Date().toISOString(),
    activeUsers: realtimeAnalytics[0],
    activeAppointments: realtimeAnalytics[1],
    systemLoad: realtimeAnalytics[2],
    recentActivities: realtimeAnalytics[3]
  };
  
  res.status(200).json({
      status: 'success',
    data: analytics
  });
}));

// Export analytics data
router.get('/export/:type', restrictTo('admin', 'hospital'), catchAsync(async (req, res) => {
  const { type } = req.params;
  const { format = 'json', period = '30d' } = req.query;
  
  const dateFilter = buildDateFilter(period);
  
  let exportData;
  
  switch (type) {
    case 'appointments':
      exportData = await exportAppointmentData(dateFilter);
      break;
    case 'patients':
      exportData = await exportPatientData(dateFilter);
      break;
    case 'revenue':
      exportData = await exportRevenueData(dateFilter);
      break;
    default:
      return res.status(400).json({
      status: 'error',
        message: 'Invalid export type'
      });
  }
  
  logAuditEvent('analytics_exported', req.user._id, { type, format, period });
  
  if (format === 'csv') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}_${period}.csv"`);
    res.send(convertToCSV(exportData));
  } else {
    res.status(200).json({
      status: 'success',
      data: exportData
    });
  }
}));

// Helper functions
function buildDateFilter(period, startDate, endDate) {
  const now = new Date();
  let start, end = now;
  
  if (startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
  } else {
    switch (period) {
      case '1d':
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
  
  return { start, end };
}

// Analytics functions
async function getAdminAnalytics() {
  const [
    totalUsers,
    totalHospitals,
    totalAppointments,
    totalRevenue,
    recentUsers,
    systemHealth
  ] = await Promise.all([
    User.countDocuments(),
    Hospital.countDocuments(),
    Appointment.countDocuments(),
    calculateTotalRevenue(),
    User.find().sort({ createdAt: -1 }).limit(10),
    getSystemHealthMetrics()
  ]);
  
  return {
    overview: {
      totalUsers,
      totalHospitals,
      totalAppointments,
      totalRevenue
    },
    recentUsers,
    systemHealth
  };
}

async function getHospitalAnalytics(hospitalId) {
  const hospital = await Hospital.findById(hospitalId);
  if (!hospital) throw new Error('Hospital not found');
  
  const [
    totalDoctors,
    totalPatients,
    totalAppointments,
    monthlyRevenue
  ] = await Promise.all([
    Doctor.countDocuments({ hospital: hospitalId }),
    Patient.countDocuments({ primaryHospital: hospitalId }),
    Appointment.countDocuments({ hospital: hospitalId }),
    calculateHospitalRevenue(hospitalId)
  ]);
  
  return {
    hospital: {
      name: hospital.name,
      location: hospital.location
    },
    overview: {
      totalDoctors,
      totalPatients,
      totalAppointments,
      monthlyRevenue
    }
  };
}

async function getDoctorAnalytics(doctorId) {
  const [
    totalAppointments,
    totalPatients,
    totalPrescriptions,
    averageRating
  ] = await Promise.all([
    Appointment.countDocuments({ doctor: doctorId }),
    Patient.countDocuments({ 'visitedHospitals.hospital': { $in: await getDoctorHospitals(doctorId) } }),
    Prescription.countDocuments({ doctor: doctorId }),
    calculateDoctorRating(doctorId)
  ]);
  
  return {
    overview: {
      totalAppointments,
      totalPatients,
      totalPrescriptions,
      averageRating
    }
  };
}

async function getPatientAnalytics(patientId) {
  const [
    totalAppointments,
    totalPrescriptions,
    healthRecords,
    upcomingAppointments
  ] = await Promise.all([
    Appointment.countDocuments({ patient: patientId }),
    Prescription.countDocuments({ patient: patientId }),
    MedicalRecord.countDocuments({ patient: patientId }),
    Appointment.find({ patient: patientId, appointmentDate: { $gte: new Date() } }).limit(5)
  ]);
  
  return {
    overview: {
      totalAppointments,
      totalPrescriptions,
      healthRecords,
      upcomingAppointments
    }
  };
}

// Additional helper functions would be implemented here...
async function getUserAnalytics(dateFilter) {
  // Implementation for user analytics
  return {};
}

async function getHospitalAnalytics(dateFilter) {
  // Implementation for hospital analytics
  return {};
}

async function getAppointmentAnalytics(dateFilter) {
  // Implementation for appointment analytics
  return {};
}

async function getRevenueAnalytics(dateFilter) {
  // Implementation for revenue analytics
  return {};
}

async function getSystemHealthMetrics() {
  // Implementation for system health metrics
  return {};
}

async function getGeographicAnalytics(dateFilter) {
  // Implementation for geographic analytics
  return {};
}

async function getPerformanceMetrics(dateFilter) {
  // Implementation for performance metrics
  return {};
}

async function calculateTotalRevenue() {
  // Implementation for total revenue calculation
  return 0;
}

async function calculateHospitalRevenue(hospitalId) {
  // Implementation for hospital revenue calculation
  return 0;
}

async function getDoctorHospitals(doctorId) {
  // Implementation to get doctor's hospitals
  return [];
}

async function calculateDoctorRating(doctorId) {
  // Implementation for doctor rating calculation
  return 0;
}

async function getActiveUsers() {
  // Implementation for active users
  return 0;
}

async function getActiveAppointments() {
  // Implementation for active appointments
  return 0;
}

async function getSystemLoad() {
  // Implementation for system load
  return {};
}

async function getRecentActivities() {
  // Implementation for recent activities
  return [];
}

async function exportAppointmentData(dateFilter) {
  // Implementation for appointment data export
  return [];
}

async function exportPatientData(dateFilter) {
  // Implementation for patient data export
  return [];
}

async function exportRevenueData(dateFilter) {
  // Implementation for revenue data export
  return [];
}

function convertToCSV(data) {
  // Implementation for CSV conversion
  return '';
}

module.exports = router;