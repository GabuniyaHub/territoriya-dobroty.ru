const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function login(email, password) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || (!adminPassword && !adminPasswordHash)) {
    throw new Error('Администратор не настроен');
  }

  if (email !== adminEmail) {
    throw new Error('Неверный логин или пароль');
  }

  const isValid = adminPasswordHash
    ? await bcrypt.compare(password, adminPasswordHash)
    : password === adminPassword;

  if (!isValid) {
    throw new Error('Неверный логин или пароль');
  }

  return jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { login };
