const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { logBusiness } = require('../utils/logger');

// Get system-wide analytics (Admin only)
const getSystemAnalytics = asyncHandler(async (req, res) => {
  try {
    const User = require('../models/User');
    const Hospital = require('../models/Hospital');
    const Appointment = require('../models/Appointment');
    const Doctor = require('../models/Doctor');
    const Patient = require('../models/Patient');
    const Prescription = require('../models/Prescription');

    // Get date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    // User statistics
    const totalUsers = await User.countDocuments();
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Hospital statistics
    const totalHospitals = await Hospital.countDocuments();
    const approvedHospitals = await Hospital.countDocuments({ isApproved: true });
    const pendingHospitals = await Hospital.countDocuments({ isApproved: false });

    // Appointment statistics
    const totalAppointments = await Appointment.countDocuments();
    const appointmentsThisMonth = await Appointment.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    const appointmentsThisWeek = await Appointment.countDocuments({
      createdAt: { $gte: startOfWeek }
    });
    const appointmentsToday = await Appointment.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    // Appointment status breakdown
    const appointmentStatuses = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Appointment types
    const appointmentTypes = await Appointment.aggregate([
      { $group: { _id: '$appointmentType', count: { $sum: 1 } } }
    ]);

    // Doctor statistics
    const totalDoctors = await Doctor.countDocuments();
    const activeDoctors = await Doctor.countDocuments({ isAvailable: true });

    // Patient statistics
    const totalPatients = await Patient.countDocuments();

    // Prescription statistics
    const totalPrescriptions = await Prescription.countDocuments();
    const prescriptionsThisMonth = await Prescription.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Revenue analytics (if consultation fees are tracked)
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$consultationFee' },
          avgRevenue: { $avg: '$consultationFee' }
        }
      }
    ]);

    // Growth trends (last 6 months)
    const growthTrends = await Appointment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top performing hospitals
    const topHospitals = await Appointment.aggregate([
      {
        $lookup: {
          from: 'hospitals',
          localField: 'hospital',
          foreignField: '_id',
          as: 'hospitalInfo'
        }
      },
      { $unwind: '$hospitalInfo' },
      {
        $group: {
          _id: '$hospital',
          hospitalName: { $first: '$hospitalInfo.name' },
          appointmentCount: { $sum: 1 },
          totalRevenue: { $sum: '$consultationFee' }
        }
      },
      { $sort: { appointmentCount: -1 } },
      { $limit: 10 }
    ]);

    // Log analytics access
    logBusiness('system_analytics_accessed', {
      userId: req.user._id,
      userRole: req.user.role
    });

    res.json({
      status: 'success',
      data: {
        overview: {
          totalUsers,
          totalHospitals,
          totalDoctors,
          totalPatients,
          totalAppointments,
          totalPrescriptions
        },
        users: {
          byRole: usersByRole,
          total: totalUsers
        },
        hospitals: {
          total: totalHospitals,
          approved: approvedHospitals,
          pending: pendingHospitals
        },
        appointments: {
          total: totalAppointments,
          thisMonth: appointmentsThisMonth,
          thisWeek: appointmentsThisWeek,
          today: appointmentsToday,
          byStatus: appointmentStatuses,
          byType: appointmentTypes
        },
        doctors: {
          total: totalDoctors,
          active: activeDoctors
        },
        prescriptions: {
          total: totalPrescriptions,
          thisMonth: prescriptionsThisMonth
        },
        revenue: revenueData[0] || { totalRevenue: 0, avgRevenue: 0 },
        trends: {
          growth: growthTrends,
          topHospitals
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch system analytics',
      error: error.message
    });
  }
});

// Get hospital analytics (Hospital role)
const getHospitalAnalytics = asyncHandler(async (req, res) => {
  try {
    const Hospital = require('../models/Hospital');
    const Appointment = require('../models/Appointment');
    const Doctor = require('../models/Doctor');
    const Patient = require('../models/Patient');
    const Prescription = require('../models/Prescription');

    // Get hospital ID from user
    let hospitalId;
    if (req.user.role === 'hospital') {
      const hospital = await Hospital.findOne({ userId: req.user._id });
      if (!hospital) {
        return res.status(404).json({
          status: 'error',
          message: 'Hospital not found for this user'
        });
      }
      hospitalId = hospital._id;
    } else if (req.user.role === 'admin') {
      hospitalId = req.query.hospitalId;
      if (!hospitalId) {
        return res.status(400).json({
          status: 'error',
          message: 'Hospital ID is required'
        });
      }
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Hospital-specific statistics
    const hospitalAppointments = await Appointment.countDocuments({ hospital: hospitalId });
    const appointmentsThisMonth = await Appointment.countDocuments({
      hospital: hospitalId,
      createdAt: { $gte: startOfMonth }
    });
    const appointmentsThisWeek = await Appointment.countDocuments({
      hospital: hospitalId,
      createdAt: { $gte: startOfWeek }
    });

    // Appointment status breakdown for hospital
    const appointmentStatuses = await Appointment.aggregate([
      { $match: { hospital: hospitalId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Department performance
    const departmentStats = await Appointment.aggregate([
      { $match: { hospital: hospitalId } },
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'departmentInfo'
        }
      },
      { $unwind: '$departmentInfo' },
      {
        $group: {
          _id: '$department',
          departmentName: { $first: '$departmentInfo.name' },
          appointmentCount: { $sum: 1 },
          totalRevenue: { $sum: '$consultationFee' }
        }
      },
      { $sort: { appointmentCount: -1 } }
    ]);

    // Doctor performance
    const doctorStats = await Appointment.aggregate([
      { $match: { hospital: hospitalId } },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      { $unwind: '$doctorInfo' },
      {
        $lookup: {
          from: 'users',
          localField: 'doctorInfo.user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$doctor',
          doctorName: { $first: '$userInfo.name' },
          specialization: { $first: '$doctorInfo.specialization' },
          appointmentCount: { $sum: 1 },
          totalRevenue: { $sum: '$consultationFee' },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { appointmentCount: -1 } },
      { $limit: 10 }
    ]);

    // Revenue analytics
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          hospital: hospitalId,
          status: 'completed',
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$consultationFee' },
          avgRevenue: { $avg: '$consultationFee' }
        }
      }
    ]);

    // Patient demographics
    const patientDemographics = await Appointment.aggregate([
      { $match: { hospital: hospitalId } },
      {
        $group: {
          _id: '$patientDetails.gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Age distribution
    const ageDistribution = await Appointment.aggregate([
      { $match: { hospital: hospitalId } },
      {
        $bucket: {
          groupBy: '$patientDetails.age',
          boundaries: [0, 18, 30, 45, 60, 100],
          default: 'Other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Monthly trends
    const monthlyTrends = await Appointment.aggregate([
      {
        $match: {
          hospital: hospitalId,
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$consultationFee' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Log analytics access
    logBusiness('hospital_analytics_accessed', {
      userId: req.user._id,
      userRole: req.user.role,
      hospitalId
    });

    res.json({
      status: 'success',
      data: {
        overview: {
          totalAppointments: hospitalAppointments,
          thisMonth: appointmentsThisMonth,
          thisWeek: appointmentsThisWeek
        },
        appointments: {
          byStatus: appointmentStatuses,
          total: hospitalAppointments
        },
        departments: departmentStats,
        doctors: doctorStats,
        revenue: revenueData[0] || { totalRevenue: 0, avgRevenue: 0 },
        demographics: {
          gender: patientDemographics,
          age: ageDistribution
        },
        trends: {
          monthly: monthlyTrends
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch hospital analytics',
      error: error.message
    });
  }
});

// Get doctor analytics (Doctor role)
const getDoctorAnalytics = asyncHandler(async (req, res) => {
  try {
    const Doctor = require('../models/Doctor');
    const Appointment = require('../models/Appointment');
    const Prescription = require('../models/Prescription');

    // Get doctor profile
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        status: 'error',
        message: 'Doctor profile not found'
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Doctor-specific statistics
    const totalAppointments = await Appointment.countDocuments({ doctor: doctor._id });
    const appointmentsThisMonth = await Appointment.countDocuments({
      doctor: doctor._id,
      createdAt: { $gte: startOfMonth }
    });
    const appointmentsThisWeek = await Appointment.countDocuments({
      doctor: doctor._id,
      createdAt: { $gte: startOfWeek }
    });

    // Appointment status breakdown
    const appointmentStatuses = await Appointment.aggregate([
      { $match: { doctor: doctor._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Prescription statistics
    const totalPrescriptions = await Prescription.countDocuments({ doctor: doctor._id });
    const prescriptionsThisMonth = await Prescription.countDocuments({
      doctor: doctor._id,
      createdAt: { $gte: startOfMonth }
    });

    // Revenue analytics
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          status: 'completed',
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$consultationFee' },
          avgRevenue: { $avg: '$consultationFee' }
        }
      }
    ]);

    // Patient demographics
    const patientDemographics = await Appointment.aggregate([
      { $match: { doctor: doctor._id } },
      {
        $group: {
          _id: '$patientDetails.gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Common conditions/diagnoses
    const commonDiagnoses = await Prescription.aggregate([
      { $match: { doctor: doctor._id } },
      {
        $group: {
          _id: '$diagnosis',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly trends
    const monthlyTrends = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$consultationFee' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Log analytics access
    logBusiness('doctor_analytics_accessed', {
      userId: req.user._id,
      userRole: req.user.role,
      doctorId: doctor._id
    });

    res.json({
      status: 'success',
      data: {
        overview: {
          totalAppointments,
          thisMonth: appointmentsThisMonth,
          thisWeek: appointmentsThisWeek,
          totalPrescriptions
        },
        appointments: {
          byStatus: appointmentStatuses,
          total: totalAppointments
        },
        prescriptions: {
          total: totalPrescriptions,
          thisMonth: prescriptionsThisMonth,
          commonDiagnoses
        },
        revenue: revenueData[0] || { totalRevenue: 0, avgRevenue: 0 },
        demographics: {
          gender: patientDemographics
        },
        trends: {
          monthly: monthlyTrends
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch doctor analytics',
      error: error.message
    });
  }
});

// Get patient analytics (Patient role)
const getPatientAnalytics = asyncHandler(async (req, res) => {
  try {
    const Patient = require('../models/Patient');
    const Appointment = require('../models/Appointment');
    const Prescription = require('../models/Prescription');
    const MedicalRecord = require('../models/MedicalRecord');

    // Get patient profile
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        status: 'error',
        message: 'Patient profile not found'
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Patient-specific statistics
    const totalAppointments = await Appointment.countDocuments({ patient: patient._id });
    const appointmentsThisMonth = await Appointment.countDocuments({
      patient: patient._id,
      createdAt: { $gte: startOfMonth }
    });

    // Appointment history
    const appointmentHistory = await Appointment.find({ patient: patient._id })
      .populate('hospital', 'name')
      .populate('doctor', 'specialization')
      .populate('department', 'name')
      .sort({ appointmentDate: -1 })
      .limit(10);

    // Prescription history
    const prescriptionHistory = await Prescription.find({ patient: patient._id })
      .populate('doctor', 'specialization')
      .sort({ createdAt: -1 })
      .limit(10);

    // Medical records
    const medicalRecords = await MedicalRecord.find({ patient: patient._id })
      .populate('doctor', 'specialization')
      .sort({ createdAt: -1 })
      .limit(10);

    // Health trends (if tracking vital signs)
    const healthTrends = await MedicalRecord.aggregate([
      { $match: { patient: patient._id } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          recordCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Log analytics access
    logBusiness('patient_analytics_accessed', {
      userId: req.user._id,
      userRole: req.user.role,
      patientId: patient._id
    });

    res.json({
      status: 'success',
      data: {
        overview: {
          totalAppointments,
          thisMonth: appointmentsThisMonth,
          totalPrescriptions: prescriptionHistory.length,
          totalMedicalRecords: medicalRecords.length
        },
        history: {
          appointments: appointmentHistory,
          prescriptions: prescriptionHistory,
          medicalRecords
        },
        trends: {
          health: healthTrends
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch patient analytics',
      error: error.message
    });
  }
});

// Generate analytics report
const generateReport = asyncHandler(async (req, res) => {
  try {
    const { reportType, startDate, endDate, format = 'json' } = req.body;

    if (!reportType || !startDate || !endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Report type, start date, and end date are required'
      });
    }

    // Generate report based on type and user role
    let reportData;
    
    switch (reportType) {
      case 'system':
        if (req.user.role !== 'admin') {
          return res.status(403).json({
            status: 'error',
            message: 'Access denied. Admin role required.'
          });
        }
        // Generate system report
        reportData = await generateSystemReport(startDate, endDate);
        break;
        
      case 'hospital':
        reportData = await generateHospitalReport(req.user, startDate, endDate);
        break;
        
      case 'doctor':
        reportData = await generateDoctorReport(req.user, startDate, endDate);
        break;
        
      case 'patient':
        reportData = await generatePatientReport(req.user, startDate, endDate);
        break;
        
      default:
        return res.status(400).json({
          status: 'error',
          message: 'Invalid report type'
        });
    }

    // Log report generation
    logBusiness('analytics_report_generated', {
      userId: req.user._id,
      userRole: req.user.role,
      reportType,
      startDate,
      endDate,
      format
    });

    res.json({
      status: 'success',
      data: {
        report: reportData,
        generatedAt: new Date().toISOString(),
        generatedBy: req.user._id,
        parameters: {
          reportType,
          startDate,
          endDate,
          format
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate report',
      error: error.message
    });
  }
});

// Helper functions for report generation
async function generateSystemReport(startDate, endDate) {
  const Appointment = require('../models/Appointment');
  const User = require('../models/User');
  const Hospital = require('../models/Hospital');

  const appointments = await Appointment.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
  });

  const users = await User.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
  });

  const hospitals = await Hospital.find({
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
  });

  return {
    period: { startDate, endDate },
    summary: {
      totalAppointments: appointments.length,
      totalUsers: users.length,
      totalHospitals: hospitals.length
    },
    details: {
      appointments,
      users,
      hospitals
    }
  };
}

async function generateHospitalReport(user, startDate, endDate) {
  // Implementation for hospital report
  return { message: 'Hospital report implementation' };
}

async function generateDoctorReport(user, startDate, endDate) {
  // Implementation for doctor report
  return { message: 'Doctor report implementation' };
}

async function generatePatientReport(user, startDate, endDate) {
  // Implementation for patient report
  return { message: 'Patient report implementation' };
}

module.exports = {
  getSystemAnalytics,
  getHospitalAnalytics,
  getDoctorAnalytics,
  getPatientAnalytics,
  generateReport
};


