const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
// const passport = require('../../config/passport');

const router = express.Router();

// Gerar JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '7d'
  });
};

// Validar CPF
const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  let digit1 = remainder < 2 ? 0 : remainder;
  
  if (parseInt(cpf.charAt(9)) !== digit1) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  let digit2 = remainder < 2 ? 0 : remainder;
  
  return parseInt(cpf.charAt(10)) === digit2;
};

// Validar CNPJ
const validateCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(cnpj.charAt(12)) !== digit1) return false;
  
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(cnpj.charAt(13)) === digit2;
};

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('userType').isIn(['pessoa', 'ong']).withMessage('Tipo de usuário inválido'),
  body('document').notEmpty().withMessage('Documento é obrigatório'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  body('location.city').notEmpty().withMessage('Cidade é obrigatória'),
  body('location.state').notEmpty().withMessage('Estado é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, userType, document, phone, location, description } = req.body;

    // Validar documento baseado no tipo de usuário
    if (userType === 'pessoa' && !validateCPF(document)) {
      return res.status(400).json({ message: 'CPF inválido' });
    }
    if (userType === 'ong' && !validateCNPJ(document)) {
      return res.status(400).json({ message: 'CNPJ inválido' });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ 
      $or: [{ email }, { document }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Usuário já existe com este email ou documento' 
      });
    }

    // Criar novo usuário
    const user = new User({
      name,
      email,
      password,
      userType,
      document,
      phone,
      location,
      description: description || ''
    });

    await user.save();

    // Gerar token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/auth/login
// @desc    Fazer login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário logado
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user.toPublicJSON());
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   GET /api/auth/google
// @desc    Iniciar autenticação com Google
// @access  Public
// router.get('/google', 
//   passport.authenticate('google', { scope: ['profile', 'email'] })
// );

// @route   GET /api/auth/google/callback
// @desc    Callback do Google OAuth
// @access  Public
// router.get('/google/callback',
//   passport.authenticate('google', { session: false }),
//   async (req, res) => {
//     try {
//       // Gerar token JWT para o usuário
//       const token = generateToken(req.user._id);
//       
//       // Redirecionar para o frontend com o token
//       res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user.toPublicJSON()))}`);
//     } catch (error) {
//       console.error('Erro no callback do Google:', error);
//       res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}?error=auth_failed`);
//     }
//   }
// );

// @route   POST /api/auth/master-login
// @desc    Login especial para administrador master
// @access  Public
router.post('/master-login', [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  body('masterKey').notEmpty().withMessage('Chave master é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, masterKey } = req.body;

    // Verificar chave master
    if (masterKey !== process.env.MASTER_KEY) {
      return res.status(403).json({ message: 'Chave master inválida' });
    }

    // Buscar usuário
    let user = await User.findOne({ email, isActive: true });
    
    if (!user) {
      // Criar usuário master se não existir
      user = new User({
        name: 'Administrador Master',
        email,
        password,
        userType: 'admin',
        role: 'master',
        location: {
          city: 'Sistema',
          state: 'Admin'
        },
        phone: '0000000000'
      });
      await user.save();
    } else {
      // Verificar senha e promover a master se necessário
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciais inválidas' });
      }
      
      // Promover a master admin
      user.role = 'master';
      user.userType = 'admin';
      await user.save();
    }

    // Gerar token
    const token = generateToken(user._id);

    res.json({
      message: 'Login master realizado com sucesso',
      token,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erro no login master:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/auth/complete-profile
// @desc    Completar perfil após login com Google
// @access  Private
router.post('/complete-profile', [
  auth,
  body('userType').isIn(['pessoa', 'ong']).withMessage('Tipo de usuário inválido'),
  body('document').optional().notEmpty().withMessage('Documento inválido'),
  body('phone').optional().notEmpty().withMessage('Telefone inválido'),
  body('location.city').optional().notEmpty().withMessage('Cidade inválida'),
  body('location.state').optional().notEmpty().withMessage('Estado inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userType, document, phone, location, description } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Validar documento se fornecido
    if (document) {
      if (userType === 'pessoa' && !validateCPF(document)) {
        return res.status(400).json({ message: 'CPF inválido' });
      }
      if (userType === 'ong' && !validateCNPJ(document)) {
        return res.status(400).json({ message: 'CNPJ inválido' });
      }
      
      // Verificar se documento já existe
      const existingUser = await User.findOne({ 
        document, 
        _id: { $ne: user._id } 
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Documento já cadastrado' });
      }
    }

    // Atualizar dados do usuário
    if (userType) user.userType = userType;
    if (document) user.document = document;
    if (phone) user.phone = phone;
    if (location) {
      if (location.city) user.location.city = location.city;
      if (location.state) user.location.state = location.state;
    }
    if (description !== undefined) user.description = description;

    await user.save();

    res.json({
      message: 'Perfil atualizado com sucesso',
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Erro ao completar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
