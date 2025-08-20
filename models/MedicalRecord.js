const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  consultation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teleconsultation'
  },
  visitDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  visitType: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency', 'routine-checkup', 'specialist-visit'],
    required: true
  },
  chiefComplaint: {
    type: String,
    required: true
  },
  symptoms: [String],
  vitalSigns: {
    temperature: Number, // in Celsius
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number, // beats per minute
    respiratoryRate: Number, // breaths per minute
    oxygenSaturation: Number, // percentage
    weight: Number, // in kg
    height: Number, // in cm
    bmi: Number
  },
  physicalExamination: {
    general: String,
    findings: [String]
  },
  diagnosis: {
    primary: { type: String, required: true },
    secondary: [String],
    icdCodes: [String]
  },
  treatment: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    procedures: [String],
    therapies: [String]
  },
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    date: Date,
    attachmentUrl: String
  }],
  imaging: [{
    type: String, // X-ray, CT, MRI, etc.
    bodyPart: String,
    findings: String,
    date: Date,
    attachmentUrl: String
  }],
  allergies: [String],
  medicalHistory: [String],
  familyHistory: [String],
  socialHistory: {
    smoking: { type: String, enum: ['never', 'former', 'current'] },
    alcohol: { type: String, enum: ['never', 'occasional', 'regular'] },
    exercise: String,
    occupation: String
  },
  followUp: {
    required: { type: Boolean, default: false },
    date: Date,
    instructions: String,
    specialist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    }
  },
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  notes: String,
  isConfidential: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ hospital: 1 });
medicalRecordSchema.index({ 'diagnosis.primary': 1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);