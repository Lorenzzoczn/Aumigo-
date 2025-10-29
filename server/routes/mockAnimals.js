const express = require('express');
const { mockAnimals } = require('../mockData');

const router = express.Router();

// @route   GET /api/animals
// @desc    Buscar animais (mockado)
// @access  Public
router.get('/', (req, res) => {
  try {
    const { search, species, size, page = 1, limit = 12 } = req.query;
    
    let filteredAnimals = [...mockAnimals];
    
    // Filtrar por espécie
    if (species) {
      filteredAnimals = filteredAnimals.filter(animal => 
        animal.species.toLowerCase() === species.toLowerCase()
      );
    }
    
    // Filtrar por tamanho
    if (size) {
      filteredAnimals = filteredAnimals.filter(animal => 
        animal.size.toLowerCase() === size.toLowerCase()
      );
    }
    
    // Busca por nome
    if (search) {
      filteredAnimals = filteredAnimals.filter(animal => 
        animal.name.toLowerCase().includes(search.toLowerCase()) ||
        animal.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedAnimals = filteredAnimals.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedAnimals,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredAnimals.length / limit),
        totalAnimals: filteredAnimals.length,
        hasNext: endIndex < filteredAnimals.length,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// @route   GET /api/animals/:id
// @desc    Buscar animal por ID (mockado)
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const animal = mockAnimals.find(a => a._id === req.params.id);
    
    if (!animal) {
      return res.status(404).json({
        success: false,
        message: 'Animal não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: animal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

module.exports = router;