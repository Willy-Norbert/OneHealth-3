const mongoose = require('mongoose');

const labOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  tests: [{
    testType: {
      type: String,
      required: true,
      enum: [
        'Blood Test',
        'Urine Test',
        'Stool Test',
        'X-Ray',
        'CT Scan',
        'MRI',
        'Ultrasound',
        'ECG',
        'Echocardiogram',
        'Biopsy',
        'Culture',
        'Pathology',
        'Microbiology',
        'Biochemistry',
        'Hematology',
        'Immunology',
        'Other'
      ]
    },
    testName: {
      type: String,
      required: true
    },
    testCode: {
      type: String,
      required: true
    },
    description: String,
    instructions: String,
    fastingRequired: {
      type: Boolean,
      default: false
    },
    fastingHours: {
      type: Number,
      default: 0
    },
    specialInstructions: String,
    priority: {
      type: String,
      enum: ['Low', 'Normal', 'High', 'Urgent'],
      default: 'Normal'
    },
    estimatedCost: {
      type: Number,
      default: 0
    }
  }],
  clinicalHistory: {
    type: String,
    maxlength: 1000
  },
  clinicalIndication: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['Ordered', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Ordered'
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  scheduledDate: Date,
  scheduledTime: String,
  collectionLocation: {
    type: String,
    enum: ['Hospital', 'Home', 'Lab', 'Other'],
    default: 'Hospital'
  },
  collectionAddress: {
    street: String,
    city: String,
    district: String,
    province: String,
    country: { type: String, default: 'Rwanda' },
    postalCode: String
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  collectedAt: Date,
  totalCost: {
    type: Number,
    default: 0
  },
  insuranceCovered: {
    type: Boolean,
    default: false
  },
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    coveragePercentage: Number
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Partially Paid', 'Insurance Pending', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Insurance', 'Mobile Money', 'Bank Transfer']
  },
  paymentReference: String,
  notes: {
    type: String,
    maxlength: 1000
  },
  externalLabId: String, // For integration with external lab systems
  externalLabName: String,
  results: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LabResult'
  }],
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String
}, {
  timestamps: true
});

// Generate order number
labOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({}) + 1;
    this.orderNumber = `LAB-${year}-${count.toString().padStart(6, '0')}`;
  }
  next();
});

// Calculate total cost
labOrderSchema.pre('save', function(next) {
  if (this.tests && this.tests.length > 0) {
    this.totalCost = this.tests.reduce((total, test) => total + (test.estimatedCost || 0), 0);
  }
  next();
});

// Indexes for efficient queries
labOrderSchema.index({ orderNumber: 1 });
labOrderSchema.index({ patient: 1, createdAt: -1 });
labOrderSchema.index({ doctor: 1, createdAt: -1 });
labOrderSchema.index({ hospital: 1, createdAt: -1 });
labOrderSchema.index({ status: 1 });
labOrderSchema.index({ priority: 1 });
labOrderSchema.index({ scheduledDate: -1 });
labOrderSchema.index({ collectedAt: -1 });

// Virtual for formatted tests
labOrderSchema.virtual('formattedTests').get(function() {
  return this.tests.map(test => ({
    testType: test.testType,
    testName: test.testName,
    testCode: test.testCode,
    priority: test.priority,
    estimatedCost: test.estimatedCost,
    formatted: `${test.testName} (${test.testCode}) - ${test.priority} Priority`
  }));
});

// Method to check if order is urgent
labOrderSchema.methods.isUrgent = function() {
  return this.priority === 'Urgent' || this.tests.some(test => test.priority === 'Urgent');
};

// Method to get pending tests
labOrderSchema.methods.getPendingTests = function() {
  return this.tests.filter(test => !this.results.some(result => result.testCode === test.testCode));
};

// Method to check if all tests are completed
labOrderSchema.methods.allTestsCompleted = function() {
  return this.tests.length === this.results.length;
};

module.exports = mongoose.model('LabOrder', labOrderSchema);


