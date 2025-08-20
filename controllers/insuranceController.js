const Insurance = require('../models/Insurance');

/**
 * @swagger
 * components:
 *   schemas:
 *     Insurance:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         name:
 *           type: string
 *           description: Insurance provider name
 *         type:
 *           type: string
 *           enum: [Public, Private]
 *           description: Insurance type
 *         coveragePercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Coverage percentage
 *         isActive:
 *           type: boolean
 *           description: Is the insurance provider active
 */

// @desc    Get all insurance providers
// @route   GET /api/insurance
// @access  Public
exports.getAllInsurance = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const insuranceProviders = await Insurance.find(filter)
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Insurance providers retrieved successfully',
      data: { insuranceProviders, count: insuranceProviders.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving insurance providers',
      data: { error: error.message }
    });
  }
};

// @desc    Get single insurance provider
// @route   GET /api/insurance/:id
// @access  Public
exports.getInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance provider not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Insurance provider retrieved successfully',
      data: { insurance }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving insurance provider',
      data: { error: error.message }
    });
  }
};

// @desc    Create new insurance provider
// @route   POST /api/insurance
// @access  Private (Admin only)
exports.createInsurance = async (req, res) => {
  try {
    // Check if insurance provider already exists
    const existingInsurance = await Insurance.findOne({ 
      name: req.body.name,
      type: req.body.type 
    });

    if (existingInsurance) {
      return res.status(400).json({
        success: false,
        message: 'Insurance provider with this name and type already exists',
        data: null
      });
    }

    const insurance = await Insurance.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Insurance provider created successfully',
      data: { insurance }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating insurance provider',
      data: { error: error.message }
    });
  }
};

// @desc    Update insurance provider
// @route   PUT /api/insurance/:id
// @access  Private (Admin only)
exports.updateInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance provider not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Insurance provider updated successfully',
      data: { insurance }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating insurance provider',
      data: { error: error.message }
    });
  }
};

// @desc    Delete insurance provider
// @route   DELETE /api/insurance/:id
// @access  Private (Admin only)
exports.deleteInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findByIdAndDelete(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: 'Insurance provider not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Insurance provider deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting insurance provider',
      data: { error: error.message }
    });
  }
};