const Department = require('../models/Department');
const Hospital = require('../models/Hospital');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
exports.getAllDepartments = async (req, res) => {
  try {
    const { hospital, isActive } = req.query;
    
    const filter = {};
    if (hospital) filter.hospital = hospital;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const departments = await Department.find(filter)
      .populate('hospital', 'name location')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Departments retrieved successfully',
      data: { departments, count: departments.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving departments',
      data: { error: error.message }
    });
  }
  console.log('Get all departments called');
  console.log('Query params:', req.query);
};

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id)
      .populate('hospital', 'name location contact');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department retrieved successfully',
      data: { department }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving department',
      data: { error: error.message }
    });
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin only)
exports.createDepartment = async (req, res) => {
  try {
    // Verify hospital exists
    const hospital = await Hospital.findById(req.body.hospital);
    if (!hospital) {
      return res.status(400).json({
        success: false,
        message: 'Hospital not found',
        data: null
      });
    }

    // Check if department already exists in this hospital
    const existingDepartment = await Department.findOne({
      name: req.body.name,
      hospital: req.body.hospital
    });

    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Department already exists in this hospital',
        data: null
      });
    }

    const department = await Department.create(req.body);
    await department.populate('hospital', 'name location');

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating department',
      data: { error: error.message }
    });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin only)
exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('hospital', 'name location');

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: { department }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating department',
      data: { error: error.message }
    });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin only)
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      data: { error: error.message }
    });
  }
};

// @desc    Get departments by hospital
// @route   GET /api/hospitals/:hospitalId/departments
// @access  Public
exports.getDepartmentsByHospital = async (req, res) => {
  try {
    const departments = await Department.find({ 
      hospital: req.params.hospitalId,
      isActive: true 
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      message: 'Hospital departments retrieved successfully',
      data: { departments, count: departments.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving hospital departments',
      data: { error: error.message }
    });
  }
};