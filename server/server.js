const express = require('express');
// const mongoose = require('mongoose'); // Desabilitado para desenvolvimento sem MongoDB
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
// const authRoutes = require('./routes/auth.js');
// const userRoutes = require('./routes/users.js');
// const animalRoutes = require('./routes/animals.js');
// const postRoutes = require('./routes/posts.js');
// const adminRoutes = require('./routes/admin.js');
// const adminSimple = require('./routes/adminSimple.js');
// const simpleAnimals = require('./routes/simpleAnimals.js');

// Rotas mockadas para desenvolvimento
const mockAnimalRoutes = require('./routes/mockAnimals.js');
const mockAuthRoutes = require('./routes/mockAuth.js');
const mockAdminRoutes = require('./routes/mockAdmin.js');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler.js');
const { notFound } = require('./middleware/notFound.js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Muitas tentativas. Tente novamente em alguns minutos.',
  },
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB connection - DESABILITADO PARA DESENVOLVIMENTO
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/aumigo';
// mongoose
//   .connect(mongoUri, { dbName: process.env.MONGODB_DB || undefined })
//   .then(() => console.log('✅ MongoDB connected'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

console.log('🔧 Rodando em modo desenvolvimento sem MongoDB - usando dados mockados');

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Aumigo API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes - MOCKADAS PARA DESENVOLVIMENTO
app.use('/api/auth', mockAuthRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/animals', mockAnimalRoutes);
// app.use('/api/posts', postRoutes);
app.use('/api/admin', mockAdminRoutes);
// app.use('/admin', adminSimple);
// app.use('/animais', simpleAnimals);

// Rotas básicas mockadas
app.get('/api/posts', (req, res) => {
  res.json({ success: true, data: [] });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Aumigo API running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5000'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;