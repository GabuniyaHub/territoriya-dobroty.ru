const prisma = require('../config/database');

async function createMessage(data) {
  const { name, email, message } = data;

  if (!name || !email || !message) {
    throw new Error('Поля name, email и message обязательны');
  }

  return prisma.contactMessage.create({
    data: {
      name,
      email,
      message,
    },
  });
}

module.exports = { createMessage };
