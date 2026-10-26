// backend/controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// ==================== MANAGEMENT USERS ====================
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, full_name, username, email, role, is_active, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pengguna' });
    }
};

exports.createUser = async (req, res) => {
    const { full_name, username, email, password, role } = req.body;
    if (!full_name || !username || !email || !password || !role) {
        return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        await db.query(
            'INSERT INTO users (full_name, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [full_name, username, email, password_hash, role]
        );

        res.status(201).json({ message: 'Pengguna berhasil ditambahkan' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Username atau Email sudah terdaftar' });
        }
        res.status(500).json({ message: 'Gagal menambahkan pengguna' });
    }
};

exports.updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { is_active, role } = req.body;

    try {
        let fields = [];
        let params = [];

        if (typeof is_active !== 'undefined') {
            fields.push('is_active = ?');
            params.push(is_active);
        }
        if (role) {
            fields.push('role = ?');
            params.push(role);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: 'Tidak ada data diperbarui' });
        }

        params.push(id);
        await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);

        res.json({ message: 'Data pengguna berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui pengguna' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Pengguna berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus pengguna (User terkait dengan tiket)' });
    }
};

// ==================== MANAGEMENT CATEGORIES ====================
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data kategori' });
    }
};

exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Nama kategori wajib diisi' });

    try {
        await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
        res.status(201).json({ message: 'Kategori berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan kategori' });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ message: 'Kategori berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus kategori' });
    }
};

// ==================== MANAGEMENT ASSETS ====================
exports.getAssets = async (req, res) => {
    try {
        const [assets] = await db.query(
            `SELECT a.*, u.full_name AS user_name 
       FROM assets a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC`
        );
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data aset' });
    }
};

exports.createAsset = async (req, res) => {
    const { asset_code, name, category, serial_number, user_id } = req.body;
    if (!asset_code || !name) {
        return res.status(400).json({ message: 'Kode aset dan nama wajib diisi' });
    }

    try {
        await db.query(
            'INSERT INTO assets (asset_code, name, category, serial_number, user_id) VALUES (?, ?, ?, ?, ?)',
            [asset_code, name, category, serial_number, user_id || null]
        );
        res.status(201).json({ message: 'Aset berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan aset' });
    }
};

exports.deleteAsset = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM assets WHERE id = ?', [id]);
        res.json({ message: 'Aset berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus aset' });
    }
};

// ==================== ADMIN STATS ====================
exports.getAdminStats = async (req, res) => {
    try {
        const [[{ totalTickets }]] = await db.query('SELECT COUNT(*) AS totalTickets FROM tickets');
        const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
        const [[{ totalCategories }]] = await db.query('SELECT COUNT(*) AS totalCategories FROM categories');
        const [[{ totalAssets }]] = await db.query('SELECT COUNT(*) AS totalAssets FROM assets');

        res.json({ totalTickets, totalUsers, totalCategories, totalAssets });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data statistik' });
    }
};