// backend/controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
// backend/controllers/authController.js

exports.register = async (req, res) => {
    // Biarkan destructuring tanpa mengambil 'role' dari req.body untuk keamanan
    const { full_name, username, email, password } = req.body;

    if (!full_name || !username || !email || !password) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    try {
        // Kunci role secara eksplisit menjadi 'Employee'
        const userRole = 'Employee';

        // Hash password & simpan user ke database
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO users (full_name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
            [full_name, username, email, hashedPassword, userRole]
        );

        res.status(201).json({ message: 'Registrasi berhasil!' });
    } catch (error) {
        console.error('Error Register:', error);
        res.status(500).json({ message: 'Gagal melakukan registrasi' });
    }
};

// 2. LOGIN USER
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    try {
        // Cari user berdasarkan username[cite: 2]
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Kredensial tidak valid' }); // Pesan umum untuk keamanan
        }

        const user = users[0];

        // Cek status aktif user[cite: 2]
        if (!user.is_active) {
            return res.status(403).json({ message: 'Akun Anda telah dinonaktifkan' });
        }

        // Verifikasi password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Kredensial tidak valid' });
        }

        // Buat JWT Token
        const payload = {
            id: user.id,
            full_name: user.full_name,
            username: user.username,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        });

        res.json({
            message: 'Login berhasil',
            token,
            user: payload
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// 3. GET CURRENT USER PROFILE
exports.getMe = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, username, email, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};