const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Izinkan jika request tidak memiliki origin (seperti Postman atau server-to-server)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app') || 
                      origin === process.env.FRONTEND_URL;
                      
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
