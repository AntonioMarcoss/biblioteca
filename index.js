const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const userRoutes = require('./routes/users');
const libraryRoutes = require('./routes/library');

const app = express(); 
app.use(bodyParser.json());

// Rotas principais
app.use('/users', userRoutes);
app.use('/library', libraryRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota para instalação inicial
app.get('/install', async (req, res) => {
  try {
    const defaultAdmin = {
      id: 1,
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      role: 'admin',
    };

    await fs.outputJson('./data/users.json', [defaultAdmin]);
    res.status(200).json({ message: 'Usuário administrador criado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário administrador.' });
  }
});

// Middleware de erros
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
