const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Неверный логин или пароль');
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error('Неверный логин или пароль');
  }

  return jwt.sign({ email, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { login };
