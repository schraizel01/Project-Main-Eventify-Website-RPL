const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Import Routes
const authRoutes = require('./routes/auth');
const kegiatanRoutes = require('./routes/kegiatan');
const pendaftaranRoutes = require('./routes/pendaftaran');
const pesertaRoutes = require('./routes/peserta');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/kegiatan', kegiatanRoutes);
app.use('/api/pendaftaran', pendaftaranRoutes);
app.use('/api/peserta', pesertaRoutes);

// Error Handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
