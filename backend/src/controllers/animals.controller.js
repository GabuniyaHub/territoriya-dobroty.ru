const animalsService = require('../services/animals.service');

exports.getAll = async (req, res) => {
  const animals = await animalsService.getAll();
  res.json(animals);
};

exports.getById = async (req, res) => {
  const animal = await animalsService.getById(Number(req.params.id));
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
  const animal = await animalsService.update(Number(req.params.id), req.body);
  res.json(animal);
};

exports.remove = async (req, res) => {
  await animalsService.remove(Number(req.params.id));
  res.json({ message: 'Deleted successfully' });
};
