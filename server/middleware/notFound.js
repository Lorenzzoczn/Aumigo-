export const notFound = (req, res) => {
  res.status(404).json({
    message: `Rota ${req.originalUrl} não encontrada`,
  });
};