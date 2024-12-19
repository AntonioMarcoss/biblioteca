const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsers, saveUsers } = require('../models/user');

const SECRET = 'biblioteca-api-secret';

async function registerUser(data) {
  const { username, password, role } = data;
  const users = await getUsers();

  if (users.some((u) => u.username === username)) {
    throw new Error('Usuário já existe.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now(), username, password: hashedPassword, role };
  users.push(newUser);
  await saveUsers(users);

  return newUser;
}

async function loginUser(username, password) {
  const users = await getUsers();
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Credenciais inválidas.');
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  return token;
}

module.exports = { registerUser, loginUser };
