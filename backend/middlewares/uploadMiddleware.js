// backend/middlewares/uploadMiddleware.js
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const path = require('path');

// Filter Ekstensi & MIME Type (Diselaraskan dengan allowed_formats di Cloudinary)
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|pdf/;
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf'
    ];

    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedMimeTypes.includes(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb(new Error('Format file tidak didukung! Hanya file JPEG, PNG, dan PDF yang diperbolehkan.'));
    }
};

// Langsung menggunakan storage dari Cloudinary
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5 MB
    fileFilter: fileFilter
});

module.exports = upload;
