const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const labResultSchema = new mongoose.Schema({
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
  labOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabOrder',
    required: true
  },
  
  // Lab Information
  labName: {
    type: String,
    required: true
  },
  labId: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    enum: [
      'blood_test',
      'urine_test',
      'stool_test',
      'culture',
      'biopsy',
      'imaging',
      'cardiac_test',
      'pulmonary_test',
      'neurological_test',
      'other'
    ],
    required: true
  },
  
  // Test Details
  testName: {
    type: String,
    required: true
  },
  testCode: String,
  testDescription: String,
  
  // Results
  results: [{
    parameter: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    unit: String,
    referenceRange: String,
    status: {
      type: String,
      enum: ['normal', 'high', 'low', 'critical', 'abnormal'],
      default: 'normal'
    },
    flag: {
      type: String,
      enum: ['H', 'L', 'C', 'A', 'N'], // High, Low, Critical, Abnormal, Normal
      default: 'N'
    }
  }],
  
  // Overall Result
  overallStatus: {
    type: String,
    enum: ['normal', 'abnormal', 'critical', 'pending'],
    default: 'pending'
  },
  interpretation: String,
  recommendations: String,
  
  // Quality Control
  qualityControl: {
    performed: Boolean,
    passed: Boolean,
    notes: String
  },
  
  // Dates
  collectionDate: {
    type: Date,
    required: true
  },
  receivedDate: Date,
  completedDate: Date,
  reportedDate: {
    type: Date,
    default: Date.now
  },
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  // Verification
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  verifiedAt: Date,
  
  // Comments
  comments: String,
  internalNotes: String,
  
  // Integration
  externalLabId: String,
  externalSystem: String,
  
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
labResultSchema.index({ patient: 1, createdAt: -1 });
labResultSchema.index({ doctor: 1, createdAt: -1 });
labResultSchema.index({ hospital: 1, createdAt: -1 });
labResultSchema.index({ testType: 1 });
labResultSchema.index({ status: 1 });
labResultSchema.index({ overallStatus: 1 });
labResultSchema.index({ collectionDate: -1 });
labResultSchema.index({ reportedDate: -1 });

// Virtual for critical results
labResultSchema.virtual('hasCriticalResults').get(function() {
  return this.results.some(result => result.status === 'critical');
});

// Virtual for abnormal results
labResultSchema.virtual('hasAbnormalResults').get(function() {
  return this.results.some(result => 
    result.status === 'high' || 
    result.status === 'low' || 
    result.status === 'abnormal'
  );
});

// Pre-save middleware
labResultSchema.pre('save', function(next) {
  // Auto-set reported date when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.reportedDate) {
    this.reportedDate = new Date();
  }
  
  // Auto-set overall status based on individual results
  if (this.results && this.results.length > 0) {
    const hasCritical = this.results.some(r => r.status === 'critical');
    const hasAbnormal = this.results.some(r => 
      r.status === 'high' || r.status === 'low' || r.status === 'abnormal'
    );
    
    if (hasCritical) {
      this.overallStatus = 'critical';
    } else if (hasAbnormal) {
      this.overallStatus = 'abnormal';
    } else {
      this.overallStatus = 'normal';
    }
  }
  
  next();
});

// Static methods
labResultSchema.statics.findByPatient = function(patientId, options = {}) {
  const query = { patient: patientId, isActive: true };
  
  if (options.testType) {
    query.testType = options.testType;
  }
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.dateRange) {
    query.collectionDate = {
      $gte: options.dateRange.start,
      $lte: options.dateRange.end
    };
  }
  
  return this.find(query)
    .populate('doctor', 'name specialization')
    .populate('hospital', 'name location')
    .sort({ collectionDate: -1 });
};

labResultSchema.statics.findCriticalResults = function() {
  return this.find({
    overallStatus: 'critical',
    isActive: true
  })
  .populate('patient', 'user')
  .populate('doctor', 'name phone email')
  .populate('hospital', 'name contact')
  .sort({ reportedDate: -1 });
};

labResultSchema.statics.getLabStatistics = function(hospitalId, dateRange) {
  const matchStage = {
    isActive: true,
    reportedDate: {
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
          testType: '$testType',
          status: '$overallStatus'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.testType',
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

module.exports = mongoose.model('LabResult', labResultSchema);
labResultSchema.plugin(mongoosePaginate);