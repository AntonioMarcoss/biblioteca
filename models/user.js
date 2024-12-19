const fs = require('fs').promises;
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

async function getUsers() {
  const data = await fs.readFile(usersFilePath, 'utf-8');
  return JSON.parse(data);
}

async function saveUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports = { getUsers, saveUsers };
