const express = require('express');
const { mockAnimals, mockUsers } = require('../mockData');

const router = express.Router();

// Middleware simples de autenticação admin
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido'
    });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado - apenas administradores'
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

// @route   GET /api/admin/dashboard
// @desc    Dashboard do admin
// @access  Private (Admin)
router.get('/dashboard', adminAuth, (req, res) => {
  res.json({
    success: true,
    data: {
      totalAnimals: mockAnimals.length,
      totalUsers: mockUsers.length,
      animalsAvailable: mockAnimals.filter(a => a.status === 'disponivel').length,
      animalsAdopted: mockAnimals.filter(a => a.status === 'adotado').length,
      recentAnimals: mockAnimals.slice(0, 5)
    }
  });
});

// @route   GET /api/admin/animals
// @desc    Listar todos os animais (admin)
// @access  Private (Admin)
router.get('/animals', adminAuth, (req, res) => {
  res.json({
    success: true,
    data: mockAnimals,
    total: mockAnimals.length
  });
});

// @route   PUT /api/admin/animals/:id
// @desc    Atualizar animal
// @access  Private (Admin)
router.put('/animals/:id', adminAuth, (req, res) => {
  const animal = mockAnimals.find(a => a._id === req.params.id);
  
  if (!animal) {
    return res.status(404).json({
      success: false,
      message: 'Animal não encontrado'
    });
  }
  
  // Simular atualização
  Object.assign(animal, req.body, { updatedAt: new Date() });
  
  res.json({
    success: true,
    message: 'Animal atualizado com sucesso',
    data: animal
  });
});

// @route   DELETE /api/admin/animals/:id
// @desc    Deletar animal
// @access  Private (Admin)
router.delete('/animals/:id', adminAuth, (req, res) => {
  const index = mockAnimals.findIndex(a => a._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Animal não encontrado'
    });
  }
  
  // Simular deleção (marcar como inativo)
  mockAnimals[index].isActive = false;
  
  res.json({
    success: true,
    message: 'Animal removido com sucesso'
  });
});

// @route   GET /api/admin/users
// @desc    Listar usuários
// @access  Private (Admin)
router.get('/users', adminAuth, (req, res) => {
  res.json({
    success: true,
    data: mockUsers,
    total: mockUsers.length
  });
});

module.exports = router;