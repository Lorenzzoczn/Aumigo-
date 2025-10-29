const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Animal = require('../models/Animal');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Obter perfil do usuário logado
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user.toPublicJSON());
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/users/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Email inválido'),
  body('phone').optional().notEmpty().withMessage('Telefone é obrigatório'),
  body('description').optional().isLength({ max: 500 }).withMessage('Descrição muito longa'),
  body('location.city').optional().trim().notEmpty().withMessage('Cidade é obrigatória'),
  body('location.state').optional().trim().notEmpty().withMessage('Estado é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se email já existe (se foi alterado)
    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
    }

    // Atualizar campos
    const allowedUpdates = ['name', 'email', 'phone', 'description', 'location', 'profileImage'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/users/:id
// @desc    Obter dados públicos de um usuário
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -document')
      .where('isActive').equals(true);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Buscar animais do usuário
    const animals = await Animal.find({ 
      owner: req.params.id, 
      isActive: true,
      status: 'disponivel'
    })
    .select('name age species size images location createdAt')
    .sort({ createdAt: -1 })
    .limit(6);

    res.json({
      user: user.toPublicJSON(),
      animals
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/users/:id/animals
// @desc    Obter todos os animais de um usuário
// @access  Public
router.get('/:id/animals', async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const animals = await Animal.find({ 
      owner: req.params.id, 
      isActive: true 
    })
    .populate('owner', 'name userType location profileImage')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Animal.countDocuments({ 
      owner: req.params.id, 
      isActive: true 
    });

    res.json({
      animals,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Erro ao buscar animais do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
