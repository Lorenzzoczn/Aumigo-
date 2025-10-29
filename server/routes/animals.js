const express = require('express');
const { body, validationResult } = require('express-validator');
const Animal = require('../models/Animal');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/animals
// @desc    Buscar animais com filtros
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      species,
      size,
      color,
      city,
      state,
      isCastrated,
      page = 1,
      limit = 12
    } = req.query;

    // Construir filtros
    const filters = { isActive: true, status: 'disponivel' };

    if (search) {
      filters.$text = { $search: search };
    }
    if (species) filters.species = species;
    if (size) filters.size = size;
    if (color) filters.color = new RegExp(color, 'i');
    if (city) filters['location.city'] = new RegExp(city, 'i');
    if (state) filters['location.state'] = new RegExp(state, 'i');
    if (isCastrated !== undefined) filters.isCastrated = isCastrated === 'true';

    // Paginação
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const animals = await Animal.find(filters)
      .populate('owner', 'name userType location profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Animal.countDocuments(filters);

    res.json({
      animals,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total
      }
    });

  } catch (error) {
    console.error('Erro ao buscar animais:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/animals/:id
// @desc    Obter detalhes de um animal
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
      .populate('owner', 'name userType location profileImage phone');

    if (!animal || !animal.isActive) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    res.json(animal);
  } catch (error) {
    console.error('Erro ao buscar animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/animals
// @desc    Cadastrar novo animal
// @access  Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('age').isInt({ min: 0 }).withMessage('Idade deve ser um número positivo'),
  body('species').isIn(['cachorro', 'gato', 'ave', 'coelho', 'outros']).withMessage('Espécie inválida'),
  body('size').isIn(['pequeno', 'medio', 'grande']).withMessage('Porte inválido'),
  body('color').trim().notEmpty().withMessage('Cor é obrigatória'),
  body('description').trim().isLength({ min: 10 }).withMessage('Descrição deve ter pelo menos 10 caracteres'),
  body('location.city').trim().notEmpty().withMessage('Cidade é obrigatória'),
  body('location.state').trim().notEmpty().withMessage('Estado é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      age,
      species,
      size,
      color,
      isCastrated,
      description,
      behavior,
      location,
      images,
      videos
    } = req.body;

    const animal = new Animal({
      name,
      age,
      species,
      size,
      color,
      isCastrated: isCastrated || false,
      description,
      behavior: behavior || '',
      location,
      images: images || [],
      videos: videos || [],
      owner: req.userId
    });

    await animal.save();

    const populatedAnimal = await Animal.findById(animal._id)
      .populate('owner', 'name userType location profileImage');

    res.status(201).json({
      message: 'Animal cadastrado com sucesso',
      animal: populatedAnimal
    });

  } catch (error) {
    console.error('Erro ao cadastrar animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   PUT /api/animals/:id
// @desc    Atualizar animal
// @access  Private (apenas o dono)
router.put('/:id', auth, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    if (animal.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    const updatedAnimal = await Animal.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('owner', 'name userType location profileImage');

    res.json({
      message: 'Animal atualizado com sucesso',
      animal: updatedAnimal
    });

  } catch (error) {
    console.error('Erro ao atualizar animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   DELETE /api/animals/:id
// @desc    Remover animal
// @access  Private (apenas o dono)
router.delete('/:id', auth, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ message: 'Animal não encontrado' });
    }

    if (animal.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    animal.isActive = false;
    await animal.save();

    res.json({ message: 'Animal removido com sucesso' });

  } catch (error) {
    console.error('Erro ao remover animal:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/animals/user/:userId
// @desc    Obter animais de um usuário
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const animals = await Animal.find({ 
      owner: req.params.userId, 
      isActive: true 
    })
    .populate('owner', 'name userType location profileImage')
    .sort({ createdAt: -1 });

    res.json(animals);
  } catch (error) {
    console.error('Erro ao buscar animais do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
