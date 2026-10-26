// backend/middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Konfigurasi Penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Filter Ekstensi & MIME Type
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|pdf|doc|docx|zip/;
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'application/x-zip-compressed'
    ];

    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedMimeTypes.includes(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb(new Error('Format file tidak didukung! Hanya file JPEG, PNG, PDF, DOC, DOCX, dan ZIP yang diperbolehkan.'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5 MB
    fileFilter: fileFilter
});

module.exports = upload;