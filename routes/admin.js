const express = require('express');
const { adminAuth, masterAuth } = require('../middleware/adminAuth');
const User = require('../models/User');
const Animal = require('../models/Animal');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Obter dados do dashboard admin
// @access  Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalAnimals = await Animal.countDocuments({ isActive: true });
    const availableAnimals = await Animal.countDocuments({ status: 'disponivel', isActive: true });
    const adoptedAnimals = await Animal.countDocuments({ status: 'adotado', isActive: true });
    
    // Estatísticas por espécie
    const speciesStats = await Animal.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$species', count: { $sum: 1 } } }
    ]);

    // Usuários recentes
    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email userType createdAt location');

    // Animais recentes
    const recentAnimals = await Animal.find({ isActive: true })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalAnimals,
        availableAnimals,
        adoptedAnimals,
        speciesStats
      },
      recentUsers,
      recentAnimals
    });

  } catch (error) {
    console.error('Erro ao buscar dashboard:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/users
// @desc    Listar todos os usuários
// @access  Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Alterar role do usuário (apenas master)
// @access  Master
router.put('/users/:id/role', masterAuth, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role inválida' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      message: 'Role atualizada com sucesso',
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Desativar usuário
// @access  Admin
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário desativado com sucesso' });

  } catch (error) {
    console.error('Erro ao desativar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/admin/animals
// @desc    Listar todos os animais
// @access  Admin
router.get('/animals', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const animals = await Animal.find({ isActive: true })
      .populate('owner', 'name email userType')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Animal.countDocuments({ isActive: true });

    res.json({
      animals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;