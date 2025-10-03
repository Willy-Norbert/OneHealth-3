const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Setup test database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Cleanup after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

// Global test utilities
global.testUtils = {
  // Create test user
  createTestUser: async (userData = {}) => {
    const User = require('../models/User');
    const defaultUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'patient',
      isActive: true,
      isVerified: true,
      ...userData
    };
    
    return await User.create(defaultUser);
  },
  
  // Create test hospital
  createTestHospital: async (hospitalData = {}) => {
    const Hospital = require('../models/Hospital');
    const defaultHospital = {
      name: 'Test Hospital',
      location: 'Test City',
      address: '123 Test Street',
      contact: {
        phone: '+1234567890',
        email: 'hospital@test.com'
      },
      services: ['General Medicine'],
      workingHours: {
        monday: { start: '08:00', end: '17:00' },
        tuesday: { start: '08:00', end: '17:00' },
        wednesday: { start: '08:00', end: '17:00' },
        thursday: { start: '08:00', end: '17:00' },
        friday: { start: '08:00', end: '17:00' },
        saturday: { start: '08:00', end: '12:00' },
        sunday: { start: '08:00', end: '12:00' }
      },
      isApproved: true,
      isActive: true,
      ...hospitalData
    };
    
    return await Hospital.create(defaultHospital);
  },
  
  // Create test doctor
  createTestDoctor: async (doctorData = {}) => {
    const Doctor = require('../models/Doctor');
    const defaultDoctor = {
      licenseNumber: 'DOC123456',
      specialization: 'General Medicine',
      consultationFee: 50,
      isAvailable: true,
      ...doctorData
    };
    
    return await Doctor.create(defaultDoctor);
  },
  
  // Generate JWT token for testing
  generateTestToken: (userId, role = 'patient') => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET || 'test-secret',
      { expiresIn: '1h' }
    );
  },
  
  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};


