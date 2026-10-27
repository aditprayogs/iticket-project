// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
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

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder Uploads (Mendukung akses langsung maupun via subpath /iticket-api)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/iticket-api/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API (Daftarkan ke beberapa variasi path agar fleksibel dengan konfigurasi Coolify)
const apiRoutes = [
    { path: '/auth', router: authRoutes },
    { path: '/tickets', router: ticketRoutes },
    { path: '/admin', router: adminRoutes },
    { path: '/reports', router: reportRoutes },
    { path: '/notifications', router: notificationRoutes },
    { path: '/analytics', router: analyticsRoutes }
];

apiRoutes.forEach(({ path: routePath, router }) => {
    // 1. Standar local / direct (/api/...)
    app.use(`/api${routePath}`, router);
    // 2. Subpath Coolify tanpa /api (/iticket-api/...)
    app.use(`/iticket-api${routePath}`, router);
    // 3. Subpath Coolify dengan /api (/iticket-api/api/...)
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
const ALT_PORT = (Number(PORT) === 5000) ? 3000 : 5000;
try {
    app.listen(ALT_PORT, () => {
        console.log(`Server backend juga aktif di http://localhost:${ALT_PORT}`);
    });
} catch (err) {
    console.log(`Port ${ALT_PORT} tidak dapat digunakan:`, err.message);
}
