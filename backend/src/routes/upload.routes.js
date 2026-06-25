const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

// Use the multer instance and handle errors explicitly so multer errors return JSON
router.post('/', (req, res) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      // Multer errors or other upload issues
      return res.status(400).json({ error: err.message || 'Upload error' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    return res.json({ imageUrl: `/images/${req.file.filename}` });
  });
});

module.exports = router;
