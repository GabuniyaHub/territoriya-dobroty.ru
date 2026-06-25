const prisma = require('../config/database');

async function getAll() {
  return prisma.animal.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' } });
}

async function getById(id) {
  return prisma.animal.findUnique({ where: { id } });
}

async function create(data) {
  return prisma.animal.create({ data });
}

async function update(id, data) {
  return prisma.animal.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.animal.delete({ where: { id } });
}

module.exports = { getAll, getById, create, update, remove };
