const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Usuário admin mockado
const mockAdmin = {
  _id: 'admin1',
  name: 'Administrador',
  email: 'admin@aumigo.com',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

// @route   POST /api/auth/login
// @desc    Login mockado
// @access  Public
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Credenciais de admin para desenvolvimento
    if (email === 'admin@aumigo.com' && password === 'admin123') {
      // Gerar token JWT
      const token = jwt.sign(
        { 
          userId: mockAdmin._id, 
          email: mockAdmin.email, 
          role: mockAdmin.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        token,
        user: {
          _id: mockAdmin._id,
          name: mockAdmin.name,
          email: mockAdmin.email,
          role: mockAdmin.role
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário logado
// @access  Private
router.get('/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role === 'admin') {
      res.json({
        success: true,
        user: mockAdmin
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Não autorizado'
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout (mockado)
// @access  Private
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

module.exports = router;