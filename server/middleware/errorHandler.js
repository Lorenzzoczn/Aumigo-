export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      message: 'Dados duplicados. Este email ou documento já está em uso.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      message: 'Registro não encontrado.',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Dados inválidos',
      errors: err.errors,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};