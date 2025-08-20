
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Route imports
const authRoutes = require('./routes/authRoutes');
const teleconsultationRoutes = require('./routes/teleconsultationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const orderRoutes = require('./routes/orderRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();
connectDB();

const app = express();

// CORS configuration - Fixed for credentials support
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://onehealth-ebon.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teleconsultation', teleconsultationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/emergencies', emergencyRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/ai', aiRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
