function validateBookData(req, res, next) {
    const { title, authorId } = req.body;
    if (!title || !authorId) {
      return res.status(400).json({ error: 'Dados do livro inválidos.' });
    }
    next();
  }
  
  module.exports = { validateBookData };
  