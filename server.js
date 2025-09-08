const http = require('http');
const { Server } = require("socket.io");
const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // Moved to the very top
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
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
const notificationRoutes = require('./routes/notificationRoutes'); // Import notification routes
const uploadRoutes = require('./routes/uploadRoutes'); // Import upload routes


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
  '-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'One Healthline Connect API Docs',
  })
);

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
app.use('/notifications', notificationRoutes); // Notification routes
app.use('/upload', uploadRoutes); // Upload routes

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

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!',
  });
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

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
