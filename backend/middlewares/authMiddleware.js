const jwt = require('jsonwebtoken');

// Verifikasi apakah user membawa token JWT yang valid
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <TOKEN>"

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data payload user ke request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token tidak valid atau telah kadaluwarsa' });
    }
};

// Membatasi akses route berdasarkan Role (Employee, IT Support, Admin)[cite: 1]
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses ditolak. Anda tidak memiliki izin' });
        }
        next();
    };
};