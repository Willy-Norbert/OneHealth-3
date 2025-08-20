const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pharmacy name is required'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: { type: String, required: true },
    email: String,
    website: String
  },
  operatingHours: {
    monday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    tuesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    wednesday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    thursday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    friday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    saturday: { open: String, close: String, isOpen: { type: Boolean, default: true } },
    sunday: { open: String, close: String, isOpen: { type: Boolean, default: false } }
  },
  services: [{
    type: String,
    enum: [
      'Prescription Filling',
      'Over-the-counter Medications',
      'Medical Supplies',
      'Health Consultations',
      'Drug Information',
      'Vaccination Services',
      'Home Delivery',
      'Online Ordering'
    ]
  }],
  insuranceAccepted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Insurance'
  }],
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deliveryRadius: {
    type: Number, // in kilometers
    default: 10
  },
  deliveryFee: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
pharmacySchema.index({ 'location.city': 1 });
pharmacySchema.index({ isActive: 1 });
pharmacySchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Pharmacy', pharmacySchema);