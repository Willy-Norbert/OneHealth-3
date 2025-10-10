const http = require('http');
const { Server } = require("socket.io");
const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Moved to the very top
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Security middleware imports
const {
  authLimiter,
  generalLimiter,
  strictLimiter,
  helmetConfig,
  validateInput,
  requestSizeLimiter,
  securityHeaders,
  validateApiKey,
  requestLogger,
  mongoSanitize,
  xss,
  hpp
} = require('./middleware/security');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken'); // Import jwt
const User = require('./models/User'); // Import User model

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const teleconsultationRoutes = require('./routes/teleconsultationRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const orderRoutes = require('./routes/orderRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const aiRoutes = require('./routes/aiRoutes');
const insuranceRoutes = require('./routes/insuranceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const patientRoutes = require('./routes/patientRoutes');
const labResultRoutes = require('./routes/labResultRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // Import notification routes
const uploadRoutes = require('./routes/uploadRoutes'); // Import upload routes
const healthRoutes = require('./routes/healthRoutes'); // Import health routes
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import analytics routes

// Monitoring middleware imports
const {
  requestMonitoring,
  errorMonitoring,
  securityMonitoring,
  performanceMonitoring,
  databaseMonitoring,
  apiUsageMonitoring
} = require('./middleware/monitoring');


connectDB();

const app = express();

// Behind Render/Proxies: trust X-Forwarded-* so rate limit and IPs work
// See: https://expressjs.com/en/guide/behind-proxies.html
// Trust only the first proxy hop (Render/Ingress) to avoid permissive trust
// See: https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

// Security middleware setup
app.use(helmetConfig);
app.use(securityHeaders);
app.use(requestLogger);
app.use(requestSizeLimiter);
app.use(mongoSanitize);
app.use(xss);
app.use(hpp);

// Monitoring middleware setup
app.use(requestMonitoring);
app.use(securityMonitoring);
app.use(performanceMonitoring);
app.use(databaseMonitoring);
app.use(apiUsageMonitoring);

// ✅ CORS configuration (allow frontend, Swagger, Postman, mobile)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://onehealthconnekt.onrender.com',
  'https://dashboard-onehealth.vercel.app',
  'https://onehealthconnect.onrender.com',
  'https://onehealthlineconnectsss.vercel.app',
  'https://73c65683-f30b-431e-8777-e30c30110c39.sandbox.lovable.dev',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  // Add your Vercel domain here
  'https://your-frontend.vercel.app',
  // Add any other production domains
].filter(Boolean);

// Optional pattern-based CORS allowlist (e.g., all vercel.app subdomains)
const allowedOriginPatterns = [
  /\.vercel\.app$/i,
  ...(process.env.CORS_ALLOW_REGEX ? [new RegExp(process.env.CORS_ALLOW_REGEX, 'i')] : []),
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Check regex patterns (e.g., any *.vercel.app)
      try {
        const url = new URL(origin);
        const host = url.host;
        if (allowedOriginPatterns.some((re) => re.test(host))) {
          return callback(null, true);
        }
      } catch {}
      
      // Log blocked origins for debugging
      console.warn('❌ Blocked by CORS:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      
      // In development, be more permissive
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: allowing origin');
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
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
            : ' https://onehealthconnekt.onrender.com',
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

// Apply rate limiting to specific routes
app.use('/auth', authLimiter);
app.use('/users', strictLimiter);
app.use('/hospitals', generalLimiter);

// Input validation middleware
app.use(validateInput);

// API key validation (optional)
if (process.env.API_KEYS ||'tgfl ojfl tyrt oxsv') {
  app.use(validateApiKey);
}

// ✅ Routes with  prefix
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/teleconsultation', teleconsultationRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/meetings', meetingRoutes);
app.use('/departments', departmentRoutes);
app.use('/doctors', doctorRoutes);
app.use('/emergencies', emergencyRoutes);
app.use('/pharmacies', pharmacyRoutes);
app.use('/prescriptions', prescriptionRoutes);
app.use('/orders', orderRoutes);
app.use('/medical-records', medicalRecordRoutes);
app.use('/ai', aiRoutes);
app.use('/insurance', insuranceRoutes);
app.use('/payments', paymentRoutes);
app.use('/patients', patientRoutes);
app.use('/lab-results', labResultRoutes);
app.use('/notifications', notificationRoutes); // Notification routes
app.use('/upload', uploadRoutes); // Upload routes
app.use('/health', healthRoutes); // Health check routes
app.use('/analytics', analyticsRoutes); // Analytics routes

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API test endpoint
app.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working properly',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Pharmacy route (redirect to pharmacies)
app.get('/pharmacy', (req, res) => {
  res.redirect('/pharmacies');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
  });
});

// Error monitoring middleware (must be last)
app.use(errorMonitoring);

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 25000, // default 20000
  pingInterval: 20000, // default 25000
});

// Make socket available to notificationService for real-time notifications
try { require('./utils/notificationService').setSocket(io); } catch {}

// Store a mapping of user IDs to their socket IDs
const userSocketMap = new Map();

io.use(async (socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    try {
      const token = socket.handshake.auth.token;
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id); // Assuming token has an 'id' field

      if (!currentUser) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.user = currentUser; // Attach user to socket object
      next();
    } catch (err) {
      console.error("Socket.io authentication error:", err.message);
      return next(new Error('Authentication error: Invalid token'));
    }
  } else {
    return next(new Error('Authentication error: Token not provided'));
  }
});

io.on('connection', (socket) => {
  console.log(`⚡️ User connected: ${socket.id} (User: ${socket.user.name})`);
  userSocketMap.set(socket.user._id.toString(), socket.id); // Store user ID to socket ID mapping
  // Join a personal room equal to user id for targeted events
  socket.join(socket.user._id.toString());
  console.log(`Backend: userSocketMap updated. Current map size: ${userSocketMap.size}`);

  socket.on('join-room', (roomId, cb) => {
    console.log(`User ${socket.user.name} (${socket.user._id}) joining room: ${roomId}`);

    const usersInRoom = [];
    const room = io.sockets.adapter.rooms.get(roomId);

    if (room) {
      for (const existingSocketId of room) {
        const existingSocket = io.sockets.sockets.get(existingSocketId);
        if (existingSocket && existingSocket.user && existingSocket.user._id.toString() !== socket.user._id.toString()) {
          usersInRoom.push({ id: existingSocket.user._id, name: existingSocket.user.name });
        }
      }
    }

    socket.join(roomId);

    // 1. Notify existing users in the room about the new user joining
    socket.to(roomId).emit('user-joined', socket.user._id, socket.user.name);
    console.log(`Backend: User ${socket.user.name} (${socket.user._id}) broadcasted 'user-joined' to room ${roomId}`);

    // 2. Send the newly joined user a list of existing users in the room
    if (usersInRoom.length > 0) {
      socket.emit('room-users', usersInRoom);
      console.log(`Backend: Sent 'room-users' to ${socket.user.name} (${socket.user._id}) with existing users:`, usersInRoom);
    } else {
      console.log(`Backend: No existing users to send 'room-users' to ${socket.user.name} (${socket.user._id}).`);
    }

    if (cb) cb({ status: 'ok' });
  });

  socket.on('offer', (offer, roomId, receiverId) => {
    console.log(`Offer from ${socket.user.name} (${socket.user._id}) to ${receiverId} in room: ${roomId}`);
    if (receiverId) {
      const targetSocketId = userSocketMap.get(receiverId.toString());
      if (targetSocketId) {
        io.to(targetSocketId).emit('offer', offer, roomId, socket.user._id);
        console.log(`Backend: Offer sent from ${socket.user._id} to socket ${targetSocketId} for user ${receiverId}`);
      } else {
        console.warn(`Backend: Could not find socket ID for receiver ${receiverId} to send offer.`);
      }
    } else {
      // Fallback: broadcast to room (excluding sender)
      socket.to(roomId).emit('offer', offer, roomId, socket.user._id);
      console.log(`Backend: Broadcast offer in room ${roomId} from ${socket.user._id}`);
    }
  });

  socket.on('answer', (answer, roomId, receiverId) => {
    console.log(`Answer from ${socket.user.name} (${socket.user._id}) to ${receiverId} in room: ${roomId}`);
    if (receiverId) {
      const targetSocketId = userSocketMap.get(receiverId.toString());
      if (targetSocketId) {
        io.to(targetSocketId).emit('answer', answer, roomId, socket.user._id);
        console.log(`Backend: Answer sent from ${socket.user._id} to socket ${targetSocketId} for user ${receiverId}`);
      } else {
        console.warn(`Backend: Could not find socket ID for receiver ${receiverId} to send answer.`);
      }
    } else {
      socket.to(roomId).emit('answer', answer, roomId, socket.user._id);
      console.log(`Backend: Broadcast answer in room ${roomId} from ${socket.user._id}`);
    }
  });

  socket.on('ice-candidate', (candidate, roomId, receiverId) => {
    console.log(`ICE Candidate from ${socket.user.name} (${socket.user._id}) to ${receiverId} in room: ${roomId}`);
    if (receiverId) {
      const targetSocketId = userSocketMap.get(receiverId.toString());
      if (targetSocketId) {
        io.to(targetSocketId).emit('ice-candidate', candidate, roomId, socket.user._id);
        console.log(`Backend: ICE Candidate sent from ${socket.user._id} to socket ${targetSocketId} for user ${receiverId}`);
      } else {
        console.warn(`Backend: Could not find socket ID for receiver ${receiverId} to send ICE candidate.`);
      }
    } else {
      socket.to(roomId).emit('ice-candidate', candidate, roomId, socket.user._id);
      console.log(`Backend: Broadcast ICE candidate in room ${roomId} from ${socket.user._id}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id} (User: ${socket.user.name})`);
    // Remove user from the map on disconnect
    userSocketMap.delete(socket.user._id.toString());
    console.log(`Backend: userSocketMap updated. Current map size: ${userSocketMap.size}`);
    // Notify all rooms this user was part of
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id) {
        socket.to(roomId).emit('user-left', socket.user._id);
      }
    }
  });
});

server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// Lightweight in-process scheduler for meeting reminders and missed detection
try {
  const Meeting = require('./models/Meeting');
  const { sendEmail, baseTemplate } = require('./services/emailService');
  const { createNotification } = require('./utils/notificationService');
  const SCHEDULER_INTERVAL_MS = parseInt(process.env.MEETING_SCHEDULER_INTERVAL_MS || '60000', 10);
  const DEFAULT_REMINDER_MIN = parseInt(process.env.MEETING_REMINDER_MINUTES || '10', 10);
  setInterval(async () => {
    try {
      const now = new Date();
      // Send reminders ~DEFAULT_REMINDER_MIN minutes before start
      const soon = new Date(now.getTime() + DEFAULT_REMINDER_MIN * 60000);
      const toRemind = await Meeting.find({ status: 'scheduled', reminderSent: false, startTime: { $lte: soon, $gte: now } }).populate(['doctor','patient']);
      for (const m of toRemind) {
        try {
          const hostUrl = process.env.FRONTEND_URL || 'https://onehealthconnekt.onrender.com';
          const meetingUrl = `${hostUrl}/meeting/${m.meeting_id}`;
          const subject = 'Reminder: Teleconsultation starting soon';
          const html = baseTemplate('Meeting Reminder', `<p>Your teleconsultation starts at ${new Date(m.startTime).toLocaleString()}.</p><p><a href="${meetingUrl}">Join Meeting</a></p>`);
          if (m?.patient?.email) await sendEmail({ to: m.patient.email, subject, html });
          if (m?.doctor?.email) await sendEmail({ to: m.doctor.email, subject, html });
          await createNotification({ recipient: String(m.patient?._id || m.patient), type: 'appointment', message: 'Your meeting starts in ~10 minutes.', relatedEntity: { id: m._id, type: 'Appointment' } });
          await createNotification({ recipient: String(m.doctor?._id || m.doctor), type: 'appointment', message: 'Your meeting starts in ~10 minutes.', relatedEntity: { id: m._id, type: 'Appointment' } });
          m.reminderSent = true;
          await m.save();
        } catch {}
      }
      // Mark missed if past endTime and not started/completed/cancelled
      const past = await Meeting.find({ status: 'scheduled', endTime: { $lt: now } }).populate(['doctor','patient']);
      for (const m of past) {
        m.status = 'missed';
        await m.save();
        if (!m.missedNotified) {
          try {
            await createNotification({ recipient: String(m.patient?._id || m.patient), type: 'appointment', message: 'You missed a scheduled meeting.', relatedEntity: { id: m._id, type: 'Appointment' } });
            await createNotification({ recipient: String(m.doctor?._id || m.doctor), type: 'appointment', message: 'A scheduled meeting was missed.', relatedEntity: { id: m._id, type: 'Appointment' } });
            m.missedNotified = true;
            await m.save();
          } catch {}
        }
      }
    } catch (e) {
      // ignore scheduler loop errors
    }
  }, SCHEDULER_INTERVAL_MS);
} catch {}
