const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const animalsRoutes = require('./routes/animals.routes');
const uploadRoutes = require('./routes/upload.routes');
const contactRoutes = require('./routes/contact.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/images', express.static(path.join(__dirname, '..', '..', 'frontend', 'public', 'images')));
app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
