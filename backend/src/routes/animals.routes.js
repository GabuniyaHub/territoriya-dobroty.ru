const express = require('express');
const router = express.Router();
const animalsController = require('../controllers/animals.controller');
const authMiddleware = require('../middleware/auth');

router.get('/', animalsController.getAll);
router.get('/:id', animalsController.getById);
router.post('/', authMiddleware, animalsController.create);
router.put('/:id', authMiddleware, animalsController.update);
router.delete('/:id', authMiddleware, animalsController.remove);

module.exports = router;
