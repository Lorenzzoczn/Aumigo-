const { Router } = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User.js');
const Animal = require('../models/Animal.js');

const router = Router();

// Multer storage to /uploads
const uploadsDir = path.join(process.cwd(), 'aumigo', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

// POST /admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true });
    if (!user) return res.status(400).json({ message: 'Credenciais inválidas' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Credenciais inválidas' });
    if (!['admin', 'master'].includes(user.role)) return res.status(403).json({ message: 'Sem permissão administrativa' });
    const token = signToken(user._id);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    console.error('Erro no login admin:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Auth middleware (JWT)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Token de acesso necessário' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) return res.status(401).json({ message: 'Token inválido' });
    if (!['admin', 'master'].includes(user.role)) return res.status(403).json({ message: 'Sem permissão administrativa' });
    req.userId = user._id;
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// POST /admin/animais (with upload)
router.post('/animais', auth, upload.single('imagem'), async (req, res) => {
  try {
    const { nome, idade, especie, porte, descricao } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const animal = new Animal({
      name: nome,
      age: parseInt(idade || '0'),
      species: especie,
      size: porte,
      description: descricao,
      images: imageUrl ? [{ url: imageUrl, alt: nome, isMain: true }] : [],
      owner: req.userId,
    });
    await animal.save();
    res.status(201).json({ message: 'Animal cadastrado', id: animal._id });
  } catch (err) {
    console.error('Erro ao cadastrar animal:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// PUT /admin/animais/:id (optional upload)
router.put('/animais/:id', auth, upload.single('imagem'), async (req, res) => {
  try {
    const { nome, idade, especie, porte, descricao } = req.body;
    const updates = {
      ...(nome && { name: nome }),
      ...(idade && { age: parseInt(idade) }),
      ...(especie && { species: especie }),
      ...(porte && { size: porte }),
      ...(descricao && { description: descricao }),
      updatedAt: new Date(),
    };
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      updates.images = [{ url: imageUrl, alt: updates.name || nome, isMain: true }];
    }
    const updated = await Animal.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: 'Animal não encontrado' });
    res.json({ message: 'Animal atualizado' });
  } catch (err) {
    console.error('Erro ao editar animal:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// DELETE /admin/animais/:id
router.delete('/animais/:id', auth, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Animal não encontrado' });
    animal.isActive = false;
    await animal.save();
    res.json({ message: 'Animal removido' });
  } catch (err) {
    console.error('Erro ao remover animal:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;


