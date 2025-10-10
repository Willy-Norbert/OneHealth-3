const DrugInteraction = require('../models/DrugInteraction');
const Prescription = require('../models/Prescription');
const { catchAsync } = require('../middleware/errorHandler');
const { logger, logAuditEvent } = require('../utils/logger');

// Check drug interactions for a prescription
const checkDrugInteractions = catchAsync(async (req, res) => {
  const { medications } = req.body;

  if (!medications || !Array.isArray(medications) || medications.length < 2) {
    return res.status(400).json({
      status: 'error',
      message: 'At least two medications are required to check interactions'
    });
  }

  const interactions = [];
  const drugNames = medications.map(med => med.name.toLowerCase().trim());

  // Check all possible drug pairs
  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      const drug1 = drugNames[i];
      const drug2 = drugNames[j];

      const foundInteractions = await DrugInteraction.findByDrugs(drug1, drug2);
      
      if (foundInteractions.length > 0) {
        interactions.push({
          drug1,
          drug2,
          interactions: foundInteractions
        });
      }
    }
  }

  // Check for individual drug interactions (drugs that interact with many others)
  for (const drugName of drugNames) {
    const drugInteractions = await DrugInteraction.findByDrug(drugName);
    
    if (drugInteractions.length > 0) {
      // Filter out interactions already found in pairs
      const newInteractions = drugInteractions.filter(interaction => {
        const otherDrug = interaction.drug1.name === drugName ? 
          interaction.drug2.name : interaction.drug1.name;
        return !drugNames.includes(otherDrug);
      });

      if (newInteractions.length > 0) {
        interactions.push({
          drug: drugName,
          interactions: newInteractions
        });
      }
    }
  }

  // Sort interactions by severity
  interactions.forEach(interactionGroup => {
    if (interactionGroup.interactions) {
      interactionGroup.interactions.sort((a, b) => {
        const severityOrder = { 'contraindicated': 4, 'major': 3, 'moderate': 2, 'minor': 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      });
    }
  });

  // Calculate risk level
  const hasContraindicated = interactions.some(group => 
    group.interactions?.some(interaction => interaction.severity === 'contraindicated')
  );
  const hasMajor = interactions.some(group => 
    group.interactions?.some(interaction => interaction.severity === 'major')
  );

  const riskLevel = hasContraindicated ? 'critical' : 
                   hasMajor ? 'high' : 
                   interactions.length > 0 ? 'moderate' : 'low';

  logAuditEvent('drug_interactions_checked', req.user._id, { 
    medicationCount: medications.length,
    interactionCount: interactions.length,
    riskLevel 
  });

  res.status(200).json({
    status: 'success',
    data: {
      medications: drugNames,
      interactions,
      riskLevel,
      summary: {
        totalInteractions: interactions.length,
        hasContraindicated,
        hasMajor,
        requiresMonitoring: interactions.some(group => 
          group.interactions?.some(interaction => interaction.requiresMonitoring())
        )
      }
    }
  });
});

// Get all drug interactions with filtering
const getAllDrugInteractions = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    severity, 
    interactionType, 
    clinicalSignificance,
    search,
    sortBy = 'severity',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (severity) filter.severity = severity;
  if (interactionType) filter.interactionType = interactionType;
  if (clinicalSignificance) filter.clinicalSignificance = clinicalSignificance;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  let query;
  
  if (search) {
    // Use text search
    query = DrugInteraction.searchInteractions(search);
  } else {
    // Use regular query with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    };
    query = DrugInteraction.paginate(filter, options);
  }

  const results = await query;

  logAuditEvent('drug_interactions_accessed', req.user._id, { 
    filter: Object.keys(filter),
    searchTerm: search,
    count: results.totalDocs || results.length 
  });

  res.status(200).json({
    status: 'success',
    data: results
  });
});

// Get drug interaction by ID
const getDrugInteraction = catchAsync(async (req, res) => {
  const { id } = req.params;

  const interaction = await DrugInteraction.findById(id);

  if (!interaction) {
    return res.status(404).json({
      status: 'error',
      message: 'Drug interaction not found'
    });
  }

  logAuditEvent('drug_interaction_accessed', req.user._id, { interactionId: id });

  res.status(200).json({
    status: 'success',
    data: interaction
  });
});

// Create new drug interaction
const createDrugInteraction = catchAsync(async (req, res) => {
  const interactionData = {
    ...req.body,
    createdBy: req.user._id
  };

  // Validate required fields
  if (!interactionData.drug1?.name || !interactionData.drug2?.name) {
    return res.status(400).json({
      status: 'error',
      message: 'Both drug names are required'
    });
  }

  if (!interactionData.severity || !interactionData.description) {
    return res.status(400).json({
      status: 'error',
      message: 'Severity and description are required'
    });
  }

  // Check if interaction already exists
  const existingInteraction = await DrugInteraction.findOne({
    $or: [
      { 'drug1.name': interactionData.drug1.name.toLowerCase(), 'drug2.name': interactionData.drug2.name.toLowerCase() },
      { 'drug1.name': interactionData.drug2.name.toLowerCase(), 'drug2.name': interactionData.drug1.name.toLowerCase() }
    ],
    isActive: true
  });

  if (existingInteraction) {
    return res.status(409).json({
      status: 'error',
      message: 'Drug interaction already exists'
    });
  }

  const interaction = await DrugInteraction.create(interactionData);

  logAuditEvent('drug_interaction_created', req.user._id, { 
    interactionId: interaction._id,
    drug1: interaction.drug1.name,
    drug2: interaction.drug2.name,
    severity: interaction.severity
  });

  res.status(201).json({
    status: 'success',
    data: interaction
  });
});

// Update drug interaction
const updateDrugInteraction = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const interaction = await DrugInteraction.findById(id);
  if (!interaction) {
    return res.status(404).json({
      status: 'error',
      message: 'Drug interaction not found'
    });
  }

  // Only admins and creators can update
  if (req.user.role !== 'admin' && interaction.createdBy?.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied to update this drug interaction'
    });
  }

  const updatedInteraction = await DrugInteraction.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  logAuditEvent('drug_interaction_updated', req.user._id, { 
    interactionId: id,
    updatedFields: Object.keys(updateData)
  });

  res.status(200).json({
    status: 'success',
    data: updatedInteraction
  });
});

// Verify drug interaction
const verifyDrugInteraction = catchAsync(async (req, res) => {
  const { id } = req.params;

  const interaction = await DrugInteraction.findById(id);
  if (!interaction) {
    return res.status(404).json({
      status: 'error',
      message: 'Drug interaction not found'
    });
  }

  // Only admins and medical professionals can verify
  if (!['admin', 'doctor'].includes(req.user.role)) {
    return res.status(403).json({
      status: 'error',
      message: 'Only medical professionals can verify drug interactions'
    });
  }

  interaction.verifiedBy = req.user._id;
  interaction.verifiedAt = new Date();
  await interaction.save();

  logAuditEvent('drug_interaction_verified', req.user._id, { interactionId: id });

  res.status(200).json({
    status: 'success',
    data: interaction
  });
});

// Get critical drug interactions
const getCriticalDrugInteractions = catchAsync(async (req, res) => {
  const criticalInteractions = await DrugInteraction.findCriticalInteractions();

  logAuditEvent('critical_drug_interactions_accessed', req.user._id, { 
    count: criticalInteractions.length 
  });

  res.status(200).json({
    status: 'success',
    data: criticalInteractions
  });
});

// Get interactions by drug name
const getInteractionsByDrug = catchAsync(async (req, res) => {
  const { drugName } = req.params;

  if (!drugName) {
    return res.status(400).json({
      status: 'error',
      message: 'Drug name is required'
    });
  }

  const interactions = await DrugInteraction.findByDrug(drugName);

  logAuditEvent('drug_interactions_by_drug_accessed', req.user._id, { 
    drugName,
    count: interactions.length 
  });

  res.status(200).json({
    status: 'success',
    data: {
      drugName,
      interactions
    }
  });
});

// Get drug interaction statistics
const getDrugInteractionStatistics = catchAsync(async (req, res) => {
  const { severity, interactionType } = req.query;

  const pipeline = [
    { $match: { isActive: true } }
  ];

  if (severity) {
    pipeline[0].$match.severity = severity;
  }

  if (interactionType) {
    pipeline[0].$match.interactionType = interactionType;
  }

  pipeline.push(
    {
      $group: {
        _id: {
          severity: '$severity',
          interactionType: '$interactionType',
          clinicalSignificance: '$clinicalSignificance'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.severity',
        interactionTypes: {
          $push: {
            type: '$_id.interactionType',
            significance: '$_id.clinicalSignificance',
            count: '$count'
          }
        },
        total: { $sum: '$count' }
      }
    }
  );

  const statistics = await DrugInteraction.aggregate(pipeline);

  // Get total counts
  const totalInteractions = await DrugInteraction.countDocuments({ isActive: true });
  const criticalCount = await DrugInteraction.countDocuments({ 
    isActive: true, 
    $or: [
      { severity: 'contraindicated' },
      { severity: 'major' },
      { clinicalSignificance: 'critical' }
    ]
  });

  logAuditEvent('drug_interaction_statistics_accessed', req.user._id, { 
    severity,
    interactionType 
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalInteractions,
      criticalCount,
      statistics,
      summary: {
        criticalPercentage: totalInteractions > 0 ? (criticalCount / totalInteractions * 100).toFixed(2) : 0
      }
    }
  });
});

// Delete drug interaction (soft delete)
const deleteDrugInteraction = catchAsync(async (req, res) => {
  const { id } = req.params;

  const interaction = await DrugInteraction.findById(id);
  if (!interaction) {
    return res.status(404).json({
      status: 'error',
      message: 'Drug interaction not found'
    });
  }

  // Only admins can delete
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Only admins can delete drug interactions'
    });
  }

  // Soft delete
  interaction.isActive = false;
  await interaction.save();

  logAuditEvent('drug_interaction_deleted', req.user._id, { interactionId: id });

  res.status(200).json({
    status: 'success',
    message: 'Drug interaction deleted successfully'
  });
});

// Bulk import drug interactions
const bulkImportDrugInteractions = catchAsync(async (req, res) => {
  const { interactions } = req.body;

  if (!interactions || !Array.isArray(interactions)) {
    return res.status(400).json({
      status: 'error',
      message: 'Interactions array is required'
    });
  }

  // Only admins can bulk import
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Only admins can bulk import drug interactions'
    });
  }

  const results = {
    imported: 0,
    skipped: 0,
    errors: []
  };

  for (let i = 0; i < interactions.length; i++) {
    try {
      const interactionData = {
        ...interactions[i],
        createdBy: req.user._id
      };

      // Check if interaction already exists
      const existingInteraction = await DrugInteraction.findOne({
        $or: [
          { 'drug1.name': interactionData.drug1.name.toLowerCase(), 'drug2.name': interactionData.drug2.name.toLowerCase() },
          { 'drug1.name': interactionData.drug2.name.toLowerCase(), 'drug2.name': interactionData.drug1.name.toLowerCase() }
        ],
        isActive: true
      });

      if (existingInteraction) {
        results.skipped++;
        continue;
      }

      await DrugInteraction.create(interactionData);
      results.imported++;
    } catch (error) {
      results.errors.push({
        index: i,
        error: error.message,
        data: interactions[i]
      });
    }
  }

  logAuditEvent('drug_interactions_bulk_imported', req.user._id, { 
    total: interactions.length,
    imported: results.imported,
    skipped: results.skipped,
    errors: results.errors.length
  });

  res.status(200).json({
    status: 'success',
    data: results
  });
});

module.exports = {
  checkDrugInteractions,
  getAllDrugInteractions,
  getDrugInteraction,
  createDrugInteraction,
  updateDrugInteraction,
  verifyDrugInteraction,
  getCriticalDrugInteractions,
  getInteractionsByDrug,
  getDrugInteractionStatistics,
  deleteDrugInteraction,
  bulkImportDrugInteractions
};


































