const Pharmacy = require('../models/Pharmacy');

// @desc    Get all pharmacies with filtering and pagination
// @route   GET /api/pharmacies
// @access  Public
exports.getAllPharmacies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { city, isActive, lat, lng, radius } = req.query;
    
    let filter = {};
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    let query = Pharmacy.find(filter);

    // Location-based search
    if (lat && lng) {
      const searchRadius = radius ? parseInt(radius) : 10; // default 10km
      query = query.find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: searchRadius * 1000 // convert km to meters
          }
        }
      });
    }

    const pharmacies = await query
      .populate('insuranceAccepted', 'name type')
      .skip(skip)
      .limit(limit)
      .sort({ 'rating.average': -1 });

    const total = await Pharmacy.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Pharmacies retrieved successfully',
      data: { 
        pharmacies, 
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving pharmacies',
      data: { error: error.message }
    });
  }
};

// @desc    Get single pharmacy
// @route   GET /api/pharmacies/:id
// @access  Public
exports.getPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id)
      .populate('insuranceAccepted', 'name type')
      .populate('owner', 'fullName email phoneNumber');

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pharmacy retrieved successfully',
      data: { pharmacy }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving pharmacy',
      data: { error: error.message }
    });
  }
};

// @desc    Create new pharmacy
// @route   POST /api/pharmacies
// @access  Private (Admin only)
exports.createPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);
    await pharmacy.populate('insuranceAccepted', 'name type');

    res.status(201).json({
      success: true,
      message: 'Pharmacy created successfully',
      data: { pharmacy }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating pharmacy',
      data: { error: error.message }
    });
  }
};

// @desc    Update pharmacy
// @route   PUT /api/pharmacies/:id
// @access  Private (Admin or Pharmacy Owner)
exports.updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    
    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found',
        data: null
      });
    }

    // Check permissions - admin can update any pharmacy, owners can only update their own
    if (req.user.role !== 'admin' && pharmacy.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pharmacy',
        data: null
      });
    }

    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('insuranceAccepted', 'name type');

    res.status(200).json({
      success: true,
      message: 'Pharmacy updated successfully',
      data: { pharmacy: updatedPharmacy }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating pharmacy',
      data: { error: error.message }
    });
  }
};

// @desc    Delete pharmacy
// @route   DELETE /api/pharmacies/:id
// @access  Private (Admin only)
exports.deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findByIdAndDelete(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pharmacy deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting pharmacy',
      data: { error: error.message }
    });
  }
};

// @desc    Get pharmacies near location
// @route   GET /api/pharmacies/near
// @access  Public
exports.getPharmaciesNear = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
        data: null
      });
    }

    const pharmacies = await Pharmacy.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // convert km to meters
        }
      },
      isActive: true
    }).populate('insuranceAccepted', 'name type');

    res.status(200).json({
      success: true,
      message: 'Nearby pharmacies retrieved successfully',
      data: { pharmacies, count: pharmacies.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving nearby pharmacies',
      data: { error: error.message }
    });
  }
};