const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  species: {
    type: String,
    enum: ['cachorro', 'gato', 'ave', 'coelho', 'outros'],
    required: true
  },
  size: {
    type: String,
    enum: ['pequeno', 'medio', 'grande'],
    required: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  isCastrated: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  behavior: {
    type: String,
    maxlength: 500
  },
  images: [{
    url: String,
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: String,
    title: String
  }],
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['disponivel', 'adotado', 'pausado'],
    default: 'disponivel'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Atualizar updatedAt antes de salvar
animalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para busca
animalSchema.index({ name: 'text', description: 'text', behavior: 'text' });
animalSchema.index({ species: 1, size: 1, isCastrated: 1 });
animalSchema.index({ 'location.city': 1, 'location.state': 1 });

module.exports = mongoose.model('Animal', animalSchema);

