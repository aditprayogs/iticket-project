// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/db'); // Pastikan path ke config db sesuai
require('dotenv').config();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Wajib untuk Coolify / Traefik Reverse Proxy agar IP asli terbaca oleh Rate Limiter & Audit Log
app.set('trust proxy', 1);

// 1. Amankan HTTP Headers (Izinkan akses cross-origin untuk folder /uploads)
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);

// 2. Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Rate Limiter khusus Login (Maksimal 5 percobaan per 15 menit per IP)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 5,
    message: { message: 'Terlalu banyak percobaan login gagal. Coba lagi dalam 15 menit.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Terapkan limiter di semua variasi path login Coolify
app.use(['/api/auth/login', '/iticket-api/auth/login', '/iticket-api/api/auth/login'], loginLimiter);

// Static Folder Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/iticket-api/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint (Untuk Monitoring Coolify / Uptime)
app.get(['/api/health', '/iticket-api/health', '/iticket-api/api/health'], async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.status(200).json({
            status: 'OK',
            database: 'Connected',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            database: 'Disconnected',
            message: error.message
        });
    }
});

// Routes API
const apiRoutes = [
    { path: '/auth', router: authRoutes },
    { path: '/tickets', router: ticketRoutes },
    { path: '/admin', router: adminRoutes },
    { path: '/reports', router: reportRoutes },
    { path: '/notifications', router: notificationRoutes },
    { path: '/analytics', router: analyticsRoutes }
];

apiRoutes.forEach(({ path: routePath, router }) => {
    app.use(`/api${routePath}`, router);
    app.use(`/iticket-api${routePath}`, router);
    app.use(`/iticket-api/api${routePath}`, router);
});

// Test Route
app.get(['/', '/iticket-api'], (req, res) => {
    res.json({ message: 'API ITicket Backend Running!' });
});

// Global Error Handling Middleware (Menangkap Error Multer & Upload Size)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Ukuran file terlalu besar! Maksimal 5 MB.' });
        }
        return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ message: err.message || 'Terjadi kesalahan pada server.' });
    }
    next();
});

app.listen(PORT, () => {
    console.log(`Server backend berjalan di http://localhost:${PORT}`);
});

// Dengarkan juga di port sekunder (3000 / 5000) agar kompatibel dengan Traefik Coolify di port manapun
const ALT_PORT = Number(PORT) === 5000 ? 3000 : 5000;
const altServer = app.listen(ALT_PORT, () => {
    console.log(`Server backend juga aktif di http://localhost:${ALT_PORT}`);
});
altServer.on('error', (err) => {
    console.log(`Port sekunder ${ALT_PORT} tidak digunakan:`, err.message);
});

app.get('/cek-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 AS hasil');
    res.json({ status: 'Terkoneksi ke TiDB Cloud!', data: rows });
  } catch (error) {
    res.status(500).json({ status: 'Gagal koneksi', error: error.message });
  }
});