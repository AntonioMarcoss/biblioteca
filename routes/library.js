const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const { validateBookData } = require('../middlewares/validate');

const BOOKS_PATH = './data/books.json';
const AUTHORS_PATH = './data/authors.json';

// Funções auxiliares
async function getCollection(path) {
  return (await fs.readJson(path)) || [];
}

async function saveCollection(path, collection) {
  await fs.writeJson(path, collection);
}

// Rotas de livros/autores
router.get('/books', async (req, res) => {
  const books = await getCollection(BOOKS_PATH);
  res.status(200).json(books);
});

router.post('/books', async (req, res) => {
  const { title, authorId } = req.body;
  if (!title || !authorId) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const books = await getCollection(BOOKS_PATH);
  books.push({ id: Date.now(), title, authorId });
  await saveCollection(BOOKS_PATH, books);

  res.status(201).json({ message: 'Livro criado com sucesso.' });
});

module.exports = router;
