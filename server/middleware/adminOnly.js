const auth = require('./auth');

module.exports = function adminOnly(req, res, next) {
  // auth middleware should have set req.user
  if (!req.user || !['admin', 'master'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Acesso restrito ao administrador' });
  }
  next();
};


