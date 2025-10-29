const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar se é administrador
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin' && user.role !== 'master') {
      return res.status(403).json({ message: 'Acesso negado - Apenas administradores' });
    }

    req.userId = decoded.userId;
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Middleware para verificar se é master admin
const masterAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'master') {
      return res.status(403).json({ message: 'Acesso negado - Apenas master admin' });
    }

    req.userId = decoded.userId;
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = { adminAuth, masterAuth };