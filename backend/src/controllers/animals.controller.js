const animalsService = require('../services/animals.service');

exports.getAll = async (req, res) => {
  const animals = await animalsService.getAll();
  res.json(animals);
};

exports.getById = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: 'Animal not found' });
  }

  const animal = await animalsService.getById(id);
  if (!animal) {
    return res.status(404).json({ error: 'Animal not found' });
  }

  res.json(animal);
};

exports.create = async (req, res) => {
  const animal = await animalsService.create(req.body);
  res.status(201).json(animal);
};

exports.update = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: 'Animal not found' });
  }

  const animal = await animalsService.update(id, req.body);
  res.json(animal);
};

exports.remove = async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({ error: 'Animal not found' });
  }

  await animalsService.remove(id);
  res.json({ message: 'Deleted successfully' });
};
