const express = require('express');
// const mongoose = require('mongoose'); // Desabilitado para desenvolvimento sem MongoDB
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

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
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}

console.log(`🔧 Carregando configuração para: ${process.env.NODE_ENV || 'development'}`);

const app = express();
// No Render, a porta é fornecida dinamicamente
const PORT = process.env.PORT || (process.env.NODE_ENV === 'production' ? 10000 : 3002);

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
  // Múltiplos caminhos possíveis para a pasta dist
  const possibleDistPaths = [
    path.join(__dirname, '../dist'),
    path.join(process.cwd(), 'dist'),
    path.join(__dirname, '../../dist'),
    path.join(__dirname, 'dist'),
  ];
  
  let distPath = null;
  
  for (const testPath of possibleDistPaths) {
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      break;
    }
  }
  
  if (distPath) {
    app.use(express.static(distPath));
    console.log('📁 Serving static files from:', distPath);
  } else {
    console.warn('⚠️ Pasta dist não encontrada. Build pode não ter sido executado.');
  }
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
    // Múltiplos caminhos possíveis para o index.html
    const possiblePaths = [
      path.join(__dirname, '../dist/index.html'),           // Caminho relativo padrão
      path.join(process.cwd(), 'dist/index.html'),          // Caminho absoluto do projeto
      path.join(__dirname, '../../dist/index.html'),        // Caso esteja em subpasta
      path.join(__dirname, 'dist/index.html'),              // Caso dist esteja na mesma pasta
    ];
    
    console.log('🔍 Procurando index.html em:');
    console.log('📁 __dirname:', __dirname);
    console.log('📁 process.cwd():', process.cwd());
    
    let indexPath = null;
    
    // Tentar cada caminho possível
    for (const testPath of possiblePaths) {
      console.log('🔍 Testando:', testPath);
      if (fs.existsSync(testPath)) {
        indexPath = testPath;
        console.log('✅ Encontrado em:', indexPath);
        break;
      }
    }
    
    if (indexPath) {
      res.sendFile(path.resolve(indexPath));
    } else {
      console.error('❌ index.html não encontrado em nenhum dos caminhos');
      
      // Listar arquivos disponíveis para debug
      const debugPaths = [
        __dirname,
        path.join(__dirname, '..'),
        process.cwd()
      ];
      
      debugPaths.forEach(debugPath => {
        try {
          if (fs.existsSync(debugPath)) {
            console.log(`📋 Arquivos em ${debugPath}:`, fs.readdirSync(debugPath).join(', '));
          }
        } catch (err) {
          console.log(`❌ Erro ao listar ${debugPath}:`, err.message);
        }
      });
      
      res.status(404).send(`
        <h1>Build não encontrado</h1>
        <p>Execute: npm run build</p>
        <p>Servidor procurou em:</p>
        <ul>
          ${possiblePaths.map(p => `<li>${p}</li>`).join('')}
        </ul>
      `);
    }
  });
}

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Aumigo API running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5000'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Tratamento de erro para porta ocupada
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Porta ${PORT} já está em uso!`);
    
    if (process.env.NODE_ENV !== 'production') {
      // Em desenvolvimento, tentar uma porta alternativa
      const alternativePort = PORT + 1;
      console.log(`🔄 Tentando porta alternativa: ${alternativePort}`);
      
      const alternativeServer = app.listen(alternativePort, () => {
        console.log(`🚀 Aumigo API running on alternative port ${alternativePort}`);
        console.log(`📊 Health check: http://localhost:${alternativePort}/health`);
      });
      
      alternativeServer.on('error', (altErr) => {
        console.error('❌ Erro na porta alternativa:', altErr.message);
        process.exit(1);
      });
    } else {
      // Em produção, falhar imediatamente
      console.error('❌ Não é possível iniciar o servidor em produção');
      process.exit(1);
    }
  } else {
    console.error('❌ Erro no servidor:', err.message);
    process.exit(1);
  }
});

module.exports = app;