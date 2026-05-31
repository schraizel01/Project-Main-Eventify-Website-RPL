const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { 
  getAllKegiatan, 
  getKegiatanById, 
  createKegiatan, 
  updateKegiatan, 
  deleteKegiatan,
  getDashboardStats
} = require('../controllers/kegiatanController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Multer file filter and limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Hanya diperbolehkan mengunggah file gambar (JPEG, JPG, PNG, WEBP, GIF)!'));
  }
});

// Public routes
router.get('/', getAllKegiatan);
router.get('/:id', getKegiatanById);

// Admin routes (Protected)
router.get('/admin/dashboard', authMiddleware, getDashboardStats);
router.post('/admin', authMiddleware, createKegiatan);
router.put('/admin/:id', authMiddleware, updateKegiatan);
router.delete('/admin/:id', authMiddleware, deleteKegiatan);

// File Upload endpoint
router.post('/admin/upload', authMiddleware, (req, res) => {
  upload.single('gambar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'Ukuran file terlalu besar! Maksimal 5MB.' });
      }
      return res.status(400).json({ success: false, message: `Kesalahan Multer: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ success: false, message: err.message });
    }

    // Everything went fine.
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang dipilih untuk diunggah!' });
    }

    try {
      const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
      const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      
      res.status(200).json({
        success: true,
        url: fileUrl,
        message: 'Gambar berhasil diunggah'
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Gagal mengunggah gambar' });
    }
  });
});

module.exports = router;
