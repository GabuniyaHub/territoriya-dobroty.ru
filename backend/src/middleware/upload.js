const fs = require('fs');
const multer = require('multer');
const path = require('path');

// АБСОЛЮТНЫЙ ПУТЬ — гарантированно правильный
const UPLOAD_DIR = '/var/www/territoriya-dobroty.ru/frontend/public/images';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    } catch (e) {}
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safeName = path.basename(file.originalname);
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Только изображения JPEG, PNG и WEBP'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;