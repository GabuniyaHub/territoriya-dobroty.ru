const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', '..', 'frontend', 'public', 'images'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
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
