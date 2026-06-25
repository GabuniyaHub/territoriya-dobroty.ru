const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth');

// Allow both authenticated and unauthenticated tracking; use authMiddleware if you want only admin events
router.post('/track', authMiddleware, analyticsController.track);

module.exports = router;
