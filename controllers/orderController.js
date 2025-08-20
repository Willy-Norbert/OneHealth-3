const Order = require('../models/Order');
const Pharmacy = require('../models/Pharmacy');
const Prescription = require('../models/Prescription');

// @desc    Get all orders with filtering
// @route   GET /api/orders
// @access  Private (Pharmacy staff/Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { pharmacy, patient, status } = req.query;
    
    let filter = {};
    if (pharmacy) filter.pharmacy = pharmacy;
    if (patient) filter.patient = patient;
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('patient', 'fullName email phoneNumber')
      .populate('pharmacy', 'name location contact')
      .populate('prescription')
      .populate('paymentInfo.insurance', 'name type')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Orders retrieved successfully',
      data: { 
        orders, 
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
      message: 'Error retrieving orders',
      data: { error: error.message }
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Patient/Pharmacy/Admin)
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('patient', 'fullName email phoneNumber')
      .populate('pharmacy', 'name location contact operatingHours')
      .populate('prescription')
      .populate('paymentInfo.insurance', 'name type');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Check permissions
    const isPatient = req.user._id.toString() === order.patient._id.toString();
    const isAdmin = req.user.role === 'admin';
    // Add pharmacy staff permission check here if needed

    if (!isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order retrieved successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving order',
      data: { error: error.message }
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Patient only)
exports.createOrder = async (req, res) => {
  try {
    // Verify pharmacy exists
    const pharmacy = await Pharmacy.findById(req.body.pharmacy);
    if (!pharmacy) {
      return res.status(400).json({
        success: false,
        message: 'Pharmacy not found',
        data: null
      });
    }

    // If prescription is provided, verify it belongs to the patient
    if (req.body.prescription) {
      const prescription = await Prescription.findById(req.body.prescription);
      if (!prescription || prescription.patient.toString() !== req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid prescription',
          data: null
        });
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    req.body.medications.forEach(med => {
      totalAmount += med.totalPrice;
    });

    // Add delivery fee if applicable
    if (req.body.deliveryInfo?.type === 'delivery') {
      totalAmount += req.body.deliveryInfo.deliveryFee || pharmacy.deliveryFee || 0;
    }

    const orderData = {
      ...req.body,
      patient: req.user._id,
      totalAmount,
      'paymentInfo.amountToPay': totalAmount - (req.body.paymentInfo?.insuranceCoverage || 0)
    };

    const order = await Order.create(orderData);
    await order.populate([
      { path: 'patient', select: 'fullName email phoneNumber' },
      { path: 'pharmacy', select: 'name location contact' },
      { path: 'prescription' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating order',
      data: { error: error.message }
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Pharmacy staff/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        $push: {
          statusHistory: {
            status,
            notes,
            timestamp: new Date()
          }
        }
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient', select: 'fullName email phoneNumber' },
      { path: 'pharmacy', select: 'name location contact' }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating order status',
      data: { error: error.message }
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Patient/Admin)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        data: null
      });
    }

    // Check permissions
    const isPatient = req.user._id.toString() === order.patient.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
        data: null
      });
    }

    // Can only cancel if order is not yet being prepared
    if (['preparing', 'ready', 'out-for-delivery', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage',
        data: null
      });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      notes: req.body.reason || 'Cancelled by patient',
      timestamp: new Date()
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      data: { error: error.message }
    });
  }
};

// @desc    Get patient's medication history
// @route   GET /api/patients/:patientId/orders
// @access  Private (Patient themselves or admin)
exports.getPatientOrders = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Check permissions
    const isPatient = req.user._id.toString() === patientId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isPatient && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these orders',
        data: null
      });
    }

    const orders = await Order.find({ patient: patientId })
      .populate('pharmacy', 'name location')
      .populate('prescription')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Patient orders retrieved successfully',
      data: { orders, count: orders.length }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving patient orders',
      data: { error: error.message }
    });
  }
};