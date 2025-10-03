const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  prescription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  medications: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    dosage: String,
    instructions: String
  }],
  orderType: {
    type: String,
    enum: ['prescription', 'over-the-counter'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryInfo: {
    type: {
      type: String,
      enum: ['pickup', 'delivery'],
      required: true
    },
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    deliveryFee: { type: Number, default: 0 },
    estimatedDeliveryTime: Date
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['cash', 'mobile-money', 'bank-transfer', 'insurance'],
      required: true
    },
    insurance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Insurance'
    },
    insuranceCoverage: { type: Number, default: 0 },
    amountToPay: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    transactionId: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    notes: String
  }],
  specialInstructions: String,
  estimatedReadyTime: Date
}, { 
  timestamps: true 
});

// Ensure orderNumber is generated before validation so 'required' passes
orderSchema.pre('validate', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(-6).toUpperCase()}`;
  }
  next();
});

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Update status history when status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Index for efficient queries
orderSchema.index({ patient: 1, createdAt: -1 });
orderSchema.index({ pharmacy: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);