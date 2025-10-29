const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Senha só é obrigatória se não for login com Google
    },
    minlength: 6
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Permite valores null/undefined únicos
  },
  avatar: {
    type: String, // URL da foto do Google
    default: null
  },
  userType: {
    type: String,
    enum: ['pessoa', 'ong', 'admin'],
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'master'],
    default: 'user'
  },
  document: {
    type: String,
    required: function() {
      return !this.googleId; // Documento só é obrigatório se não for login com Google
    },
    unique: true,
    sparse: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  location: {
    city: {
      type: String,
      required: function() {
        return !this.googleId; // Localização só é obrigatória se não for login com Google
      }
    },
    state: {
      type: String,
      required: function() {
        return !this.googleId;
      }
    }
  },
  profileImage: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    required: function() {
      return !this.googleId; // Telefone só é obrigatório se não for login com Google
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash da senha antes de salvar (apenas se houver senha)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false; // Usuários do Google não têm senha
  return bcrypt.compare(candidatePassword, this.password);
};

// Método para retornar dados públicos do usuário
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    userType: this.userType,
    description: this.description,
    location: this.location,
    profileImage: this.profileImage || this.avatar,
    phone: this.phone,
    googleId: this.googleId ? true : false, // Apenas indica se é usuário Google
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);

