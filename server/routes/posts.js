const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth.js');

const router = express.Router();
const prisma = new PrismaClient();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: { isActive: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              userType: true,
              avatar: true,
            },
          },
          likes: {
            select: {
              userId: true,
            },
          },
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.post.count({ where: { isActive: true } }),
    ]);

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/posts
// @desc    Create new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        image: image || null,
        authorId: req.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            userType: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Post criado com sucesso',
      post,
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      res.json({ message: 'Like removido', liked: false });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      res.json({ message: 'Post curtido', liked: true });
    }
  } catch (error) {
    console.error('Erro ao curtir post:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;