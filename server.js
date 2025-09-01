const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
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
const insuranceRoutes = require('./routes/insuranceRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS configuration (allow frontend, Swagger, Postman, mobile)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'https://73c65683-f30b-431e-8777-e30c30110c39.sandbox.lovable.dev',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman or server-to-server requests
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'token'],
    optionsSuccessStatus: 204,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'One Healthline Connect API',
      version: '1.0.0',
      description: 'Healthcare management system API',
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://onehealthconnect.onrender.com'
            : 'http://localhost:5000',
        description:
          process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'One Healthline Connect API Docs',
  })
);

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/teleconsultation', teleconsultationRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/departments', departmentRoutes);
app.use('/doctors', doctorRoutes);
app.use('/emergencies', emergencyRoutes);
app.use('/pharmacies', pharmacyRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use('/orders', orderRoutes);
app.use('/medical-records', medicalRecordRoutes);
app.use('/ai', aiRoutes);
app.use('/insurance', insuranceRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
