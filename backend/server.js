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

// Static Folder Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Test Route
app.get('/', (req, res) => {
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