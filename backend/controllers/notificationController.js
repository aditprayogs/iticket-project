const db = require('../config/db');

// Ambil 10 notifikasi terbaru milik user yang sedang login
exports.getUserNotifications = async (req, res) => {
    const userId = req.user.id;

    try {
        const [notifications] = await db.query(
            `SELECT *
             FROM notifications
             WHERE user_id = ?
             ORDER BY created_at DESC
                 LIMIT 10`,
            [userId]
        );

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);

        res.status(500).json({
            message: 'Gagal mengambil data notifikasi'
        });
    }
};

// Tandai semua notifikasi user sebagai telah dibaca
exports.markAsRead = async (req, res) => {
    const userId = req.user.id;

    try {
        await db.query(
            'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
            [userId]
        );

        res.json({
            message: 'Notifikasi berhasil diperbarui'
        });
    } catch (error) {
        console.error('Error updating notifications:', error);

        res.status(500).json({
            message: 'Gagal memperbarui notifikasi'
        });
    }
};