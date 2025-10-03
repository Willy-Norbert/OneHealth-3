const mongoose = require('mongoose');

const medicalImagingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
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
  
  // Imaging Information
  imagingType: {
    type: String,
    enum: [
      'xray',
      'ct_scan',
      'mri',
      'ultrasound',
      'mammography',
      'pet_scan',
      'bone_scan',
      'angiography',
      'endoscopy',
      'colonoscopy',
      'other'
    ],
    required: true
  },
  
  // Study Details
  studyName: {
    type: String,
    required: true
  },
  studyDescription: String,
  studyCode: String,
  bodyPart: {
    type: String,
    required: true
  },
  laterality: {
    type: String,
    enum: ['left', 'right', 'bilateral', 'not_applicable'],
    default: 'not_applicable'
  },
  
  // Clinical Information
  clinicalHistory: String,
  indication: {
    type: String,
    required: true
  },
  clinicalQuestion: String,
  
  // Technical Details
  technique: String,
  contrastUsed: {
    type: Boolean,
    default: false
  },
  contrastType: String,
  contrastAmount: String,
  radiationDose: String,
  equipment: {
    manufacturer: String,
    model: String,
    serialNumber: String
  },
  
  // Images
  images: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    thumbnailUrl: String,
    seriesNumber: Number,
    imageNumber: Number,
    windowCenter: Number,
    windowWidth: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // DICOM Information
  dicomInfo: {
    studyInstanceUID: String,
    seriesInstanceUID: String,
    sopInstanceUID: String,
    patientID: String,
    studyID: String,
    accessionNumber: String,
    modality: String,
    studyDate: Date,
    studyTime: String,
    seriesDescription: String,
    bodyPartExamined: String,
    patientPosition: String,
    viewPosition: String
  },
  
  // Results and Interpretation
  findings: String,
  impression: String,
  recommendations: String,
  
  // Quality Assessment
  imageQuality: {
      type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
    },
  diagnosticQuality: {
      type: String,
    enum: ['diagnostic', 'limited', 'non_diagnostic'],
    default: 'diagnostic'
    },
  
  // Radiologist Information
    radiologist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
  radiologistName: String,
  radiologistSignature: String,
  
  // Dates
  studyDate: {
    type: Date,
    required: true
  },
  studyTime: String,
  reportedDate: Date,
  verifiedDate: Date,
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'reported', 'verified', 'cancelled'],
    default: 'scheduled'
  },
  
  // Priority
  priority: {
    type: String,
    enum: ['routine', 'urgent', 'stat', 'emergency'],
    default: 'routine'
  },
  
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpReason: String,
  
  // Comparison
  comparisonStudies: [{
    studyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalImaging'
  },
    studyDate: Date,
    comparisonNotes: String
  }],
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    type: {
    type: String,
      enum: ['report', 'annotation', 'measurement', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // AI Analysis
  aiAnalysis: {
    performed: {
      type: Boolean,
      default: false
    },
    aiModel: String,
    aiResults: {
      findings: String,
      confidence: Number,
      recommendations: String
    },
    aiProcessedAt: Date
  },
  
  // Integration
  externalSystemId: String,
  externalSystem: String,
  pacsId: String,
  
  // Comments
  comments: String,
  internalNotes: String,
  
  // Metadata
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
medicalImagingSchema.index({ patient: 1, studyDate: -1 });
medicalImagingSchema.index({ doctor: 1, studyDate: -1 });
medicalImagingSchema.index({ hospital: 1, studyDate: -1 });
medicalImagingSchema.index({ imagingType: 1 });
medicalImagingSchema.index({ bodyPart: 1 });
medicalImagingSchema.index({ status: 1 });
medicalImagingSchema.index({ priority: 1 });
medicalImagingSchema.index({ studyDate: -1 });
medicalImagingSchema.index({ 'dicomInfo.studyInstanceUID': 1 });
medicalImagingSchema.index({ 'dicomInfo.accessionNumber': 1 });

// Virtual for image count
medicalImagingSchema.virtual('imageCount').get(function() {
  return this.images ? this.images.length : 0;
});

// Virtual for total file size
medicalImagingSchema.virtual('totalSize').get(function() {
  if (!this.images) return 0;
  return this.images.reduce((total, image) => total + (image.size || 0), 0);
});

// Pre-save middleware
medicalImagingSchema.pre('save', function(next) {
  // Auto-set reported date when status changes to reported
  if (this.isModified('status') && this.status === 'reported' && !this.reportedDate) {
    this.reportedDate = new Date();
  }
  
  // Auto-set verified date when status changes to verified
  if (this.isModified('status') && this.status === 'verified' && !this.verifiedDate) {
    this.verifiedDate = new Date();
  }
  
  next();
});

// Static methods
medicalImagingSchema.statics.findByPatient = function(patientId, options = {}) {
  const query = { patient: patientId, isActive: true };
  
  if (options.imagingType) {
    query.imagingType = options.imagingType;
  }
  
  if (options.bodyPart) {
    query.bodyPart = options.bodyPart;
  }
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.dateRange) {
    query.studyDate = {
      $gte: options.dateRange.start,
      $lte: options.dateRange.end
    };
  }
  
  return this.find(query)
    .populate('doctor', 'name specialization')
    .populate('hospital', 'name location')
    .populate('radiologist', 'name specialization')
    .sort({ studyDate: -1 });
};

medicalImagingSchema.statics.findUrgentStudies = function() {
  return this.find({
    priority: { $in: ['urgent', 'stat', 'emergency'] },
    status: { $in: ['scheduled', 'in_progress', 'completed'] },
    isActive: true
  })
  .populate('patient', 'user')
  .populate('doctor', 'name phone email')
  .populate('hospital', 'name contact')
  .sort({ priority: 1, studyDate: 1 });
};

medicalImagingSchema.statics.getImagingStatistics = function(hospitalId, dateRange) {
  const matchStage = {
    isActive: true,
    studyDate: {
      $gte: dateRange.start,
      $lte: dateRange.end
    }
  };
  
  if (hospitalId) {
    matchStage.hospital = hospitalId;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          imagingType: '$imagingType',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.imagingType',
        results: {
          $push: {
            status: '$_id.status',
            count: '$count'
          }
        },
        total: { $sum: '$count' }
      }
    }
  ]);
};

medicalImagingSchema.statics.findByDicomUID = function(studyInstanceUID) {
  return this.findOne({
    'dicomInfo.studyInstanceUID': studyInstanceUID,
    isActive: true
  });
};

// Instance methods
medicalImagingSchema.methods.addImage = function(imageData) {
  if (!this.images) {
    this.images = [];
  }
  
  this.images.push({
    ...imageData,
    uploadedAt: new Date()
  });
  
  return this.save();
};

medicalImagingSchema.methods.removeImage = function(imageId) {
  if (this.images) {
    this.images = this.images.filter(img => img._id.toString() !== imageId);
  }
  
  return this.save();
};

medicalImagingSchema.methods.updateStatus = function(newStatus, userId) {
  this.status = newStatus;
  
  if (newStatus === 'reported' && !this.reportedDate) {
    this.reportedDate = new Date();
  }
  
  if (newStatus === 'verified' && !this.verifiedDate) {
    this.verifiedDate = new Date();
  }
  
  return this.save();
};

module.exports = mongoose.model('MedicalImaging', medicalImagingSchema);