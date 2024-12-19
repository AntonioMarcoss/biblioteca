const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsers, saveUsers } = require('../models/user');
const { registerUser, loginUser } = require('../controllers/userController');


const router = express.Router();
const SECRET = 'biblioteca-api-secret';

// Cadastro de usuários
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const users = await getUsers();
  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ error: 'Usuário já existe.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), username, password: hashedPassword, role });
  await saveUsers(users);

  res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
});


// Login de usuários
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await getUsers();
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  res.status(200).json({ token });
});

// Middleware para autenticação
router.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido.' });
    req.user = decoded;
    next();
  });
});

// Rota para criar outros administradores
router.post('/create-admin', async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado.' });
  }

  const { username, password } = req.body;
  const users = await getUsers();

  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ error: 'Usuário já existe.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: Date.now(), username, password: hashedPassword, role: 'admin' });
  await saveUsers(users);

  res.status(201).json({ message: 'Administrador criado com sucesso.' });
});

module.exports = router;
