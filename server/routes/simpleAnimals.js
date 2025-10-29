const { Router } = require('express');
const Animal = require('../models/Animal.js');

const router = Router();

// GET /animais -> list animals (basic filters)
router.get('/', async (req, res) => {
  try {
    const { especie, idadeMin, idadeMax, porte, page = 1, limit = 12 } = req.query;
    const filters = { isActive: true, status: 'disponivel' };
    if (especie) filters.species = especie;
    if (porte) filters.size = porte;
    if (idadeMin || idadeMax) {
      filters.age = {};
      if (idadeMin) filters.age.$gte = parseInt(idadeMin);
      if (idadeMax) filters.age.$lte = parseInt(idadeMax);
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [animals, total] = await Promise.all([
      Animal.find(filters)
        .select('name age species size description images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Animal.countDocuments(filters),
    ]);
    res.json({
      data: animals.map((a) => ({
        id: a._id,
        name: a.name,
        age: a.age,
        species: a.species,
        size: a.size,
        description: a.description,
        imageUrl: a.images?.find((i) => i.isMain)?.url || a.images?.[0]?.url || null,
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (err) {
    console.error('Erro ao listar animais:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// GET /animais/:id -> animal details
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal || !animal.isActive) return res.status(404).json({ message: 'Animal não encontrado' });
    res.json({
      id: animal._id,
      name: animal.name,
      age: animal.age,
      species: animal.species,
      size: animal.size,
      description: animal.description,
      images: animal.images,
      status: animal.status,
    });
  } catch (err) {
    console.error('Erro ao obter animal:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;


