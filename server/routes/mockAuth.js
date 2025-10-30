const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Usuários mockados (simulando banco de dados em memória)
const mockUsers = [
  {
    _id: 'admin1',
    name: 'Administrador',
    email: 'admin@aumigo.com',
    password: 'admin123', // Em produção seria hash
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Função para gerar ID único
const generateId = () => 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// Função para encontrar usuário por email
const findUserByEmail = (email) => mockUsers.find(user => user.email === email);

// Função para criar usuário
const createUser = (userData) => {
  const newUser = {
    _id: generateId(),
    ...userData,
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  mockUsers.push(newUser);
  return newUser;
};

// @route   POST /api/auth/register
// @desc    Registro de usuário mockado
// @access  Public
router.post('/register', (req, res) => {
  console.log('📝 Tentativa de registro:', { name: req.body.name, email: req.body.email });
  
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senhas não coincidem'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Senha deve ter pelo menos 6 caracteres'
      });
    }
    
    // Verificar se usuário já existe
    if (findUserByEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email já está em uso'
      });
    }
    
    // Criar novo usuário
    const newUser = createUser({
      name,
      email,
      password // Em produção seria hash
    });
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    const response = {
      success: true,
      message: 'Conta criada com sucesso!',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    };
    
    console.log('✅ Registro bem-sucedido:', newUser.email);
    res.status(201).json(response);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login mockado
// @access  Public
router.post('/login', (req, res) => {
  console.log('🔐 Tentativa de login:', req.body.email);
  
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }
    
    // Buscar usuário
    const user = findUserByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    const response = {
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
    
    console.log('✅ Login bem-sucedido:', user.email);
    res.json(response);
    
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
    
    // Buscar usuário pelo ID do token
    const user = mockUsers.find(u => u._id === decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
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

// @route   GET /api/auth/users
// @desc    Listar usuários (para debug)
// @access  Public (apenas para desenvolvimento)
router.get('/users', (req, res) => {
  const usersWithoutPassword = mockUsers.map(user => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  }));
  
  res.json({
    success: true,
    message: `${mockUsers.length} usuários registrados`,
    users: usersWithoutPassword
  });
});

module.exports = router;