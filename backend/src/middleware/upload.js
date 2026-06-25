const fs = require('fs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (e) {
      // ignore if exists or cannot create; multer will report errors later
    }
    cb(null, dest);
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
