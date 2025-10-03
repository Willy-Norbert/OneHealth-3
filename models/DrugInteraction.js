const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const drugInteractionSchema = new mongoose.Schema({
  // Drug Information
  drug1: {
    name: {
      type: String,
      required: true,
      index: true
    },
    genericName: String,
    brandNames: [String],
    drugClass: String,
    mechanism: String
  },
  
  drug2: {
    name: {
      type: String,
      required: true,
      index: true
    },
    genericName: String,
    brandNames: [String],
    drugClass: String,
    mechanism: String
  },
  
  // Interaction Details
  interactionType: {
    type: String,
    enum: [
      'pharmacokinetic',
      'pharmacodynamic',
      'pharmaceutical',
      'other'
    ],
    required: true
  },
  
  severity: {
    type: String,
    enum: ['minor', 'moderate', 'major', 'contraindicated'],
    required: true
  },
  
  clinicalSignificance: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    required: true
  },
  
  // Interaction Description
  description: {
    type: String,
    required: true
  },
  
  mechanism: {
    type: String,
    required: true
  },
  
  clinicalEffects: [String],
  
  // Management
  management: {
    type: String,
    required: true
  },
  
  alternatives: [String],
  
  monitoring: {
    required: Boolean,
    parameters: [String],
    frequency: String,
    duration: String
  },
  
  // Evidence
  evidence: {
    level: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'X'],
      default: 'C'
    },
    description: String,
    references: [String]
  },
  
  // Population Considerations
  populationConsiderations: {
    elderly: String,
    pediatric: String,
    pregnancy: String,
    lactation: String,
    renalImpairment: String,
    hepaticImpairment: String
  },
  
  // Onset and Duration
  onset: {
    type: String,
    enum: ['immediate', 'rapid', 'delayed', 'variable'],
    default: 'variable'
  },
  
  duration: {
    type: String,
    enum: ['short', 'moderate', 'long', 'variable'],
    default: 'variable'
  },
  
  // Data Source
  dataSource: {
    type: String,
    enum: ['fda', 'who', 'clinical_studies', 'case_reports', 'expert_opinion', 'other'],
    default: 'clinical_studies'
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Metadata
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date
}, {
  timestamps: true
});

// Compound indexes for efficient queries
drugInteractionSchema.index({ 'drug1.name': 1, 'drug2.name': 1 });
drugInteractionSchema.index({ 'drug1.genericName': 1, 'drug2.genericName': 1 });
drugInteractionSchema.index({ severity: 1, clinicalSignificance: 1 });
drugInteractionSchema.index({ interactionType: 1 });
drugInteractionSchema.index({ isActive: 1 });

// Text index for search
drugInteractionSchema.index({
  'drug1.name': 'text',
  'drug2.name': 'text',
  'drug1.genericName': 'text',
  'drug2.genericName': 'text',
  description: 'text',
  mechanism: 'text'
});

// Static methods
drugInteractionSchema.statics.findByDrugs = function(drug1Name, drug2Name) {
  return this.find({
    $or: [
      { 'drug1.name': drug1Name, 'drug2.name': drug2Name },
      { 'drug1.name': drug2Name, 'drug2.name': drug1Name }
    ],
    isActive: true
  }).sort({ severity: 1, clinicalSignificance: 1 });
};

drugInteractionSchema.statics.findByDrug = function(drugName) {
  return this.find({
    $or: [
      { 'drug1.name': { $regex: drugName, $options: 'i' } },
      { 'drug2.name': { $regex: drugName, $options: 'i' } },
      { 'drug1.genericName': { $regex: drugName, $options: 'i' } },
      { 'drug2.genericName': { $regex: drugName, $options: 'i' } }
    ],
    isActive: true
  }).sort({ severity: 1, clinicalSignificance: 1 });
};

drugInteractionSchema.statics.findBySeverity = function(severity) {
  return this.find({
    severity: severity,
    isActive: true
  }).sort({ clinicalSignificance: 1 });
};

drugInteractionSchema.statics.findCriticalInteractions = function() {
  return this.find({
    $or: [
      { severity: 'contraindicated' },
      { severity: 'major' },
      { clinicalSignificance: 'critical' }
    ],
    isActive: true
  }).sort({ severity: 1, clinicalSignificance: 1 });
};

drugInteractionSchema.statics.searchInteractions = function(searchTerm) {
  return this.find({
    $text: { $search: searchTerm },
    isActive: true
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

drugInteractionSchema.statics.checkPrescriptionInteractions = function(medications) {
  const interactions = [];
  const drugNames = medications.map(med => med.name.toLowerCase());
  
  // Find all possible interactions between the medications
  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      const drug1 = drugNames[i];
      const drug2 = drugNames[j];
      
      // This would be implemented with actual database queries
      // For now, returning a placeholder structure
      interactions.push({
        drug1,
        drug2,
        interactions: [] // Would be populated with actual interaction data
      });
    }
  }
  
  return interactions;
};

// Instance methods
drugInteractionSchema.methods.getSeverityColor = function() {
  const colors = {
    minor: 'green',
    moderate: 'yellow',
    major: 'orange',
    contraindicated: 'red'
  };
  return colors[this.severity] || 'gray';
};

drugInteractionSchema.methods.getSeverityIcon = function() {
  const icons = {
    minor: '⚠️',
    moderate: '⚠️',
    major: '🚨',
    contraindicated: '🚫'
  };
  return icons[this.severity] || '❓';
};

drugInteractionSchema.methods.isCritical = function() {
  return this.severity === 'contraindicated' || 
         this.severity === 'major' || 
         this.clinicalSignificance === 'critical';
};

drugInteractionSchema.methods.requiresMonitoring = function() {
  return this.monitoring && this.monitoring.required;
};

// Pre-save middleware
drugInteractionSchema.pre('save', function(next) {
  // Normalize drug names
  if (this.drug1.name) {
    this.drug1.name = this.drug1.name.toLowerCase().trim();
  }
  if (this.drug2.name) {
    this.drug2.name = this.drug2.name.toLowerCase().trim();
  }
  
  // Ensure drug1 name is alphabetically before drug2 name for consistency
  if (this.drug1.name > this.drug2.name) {
    const temp = this.drug1;
    this.drug1 = this.drug2;
    this.drug2 = temp;
  }
  
  next();
});

// Virtual for interaction summary
drugInteractionSchema.virtual('summary').get(function() {
  return `${this.drug1.name} + ${this.drug2.name}: ${this.severity} interaction`;
});

module.exports = mongoose.model('DrugInteraction', drugInteractionSchema);
drugInteractionSchema.plugin(mongoosePaginate);