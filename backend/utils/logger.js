const db = require('../config/db');

/**
 * Catat aktivitas user ke tabel audit_logs
 * @param {number|null} userId - ID user yang melakukan aksi
 * @param {string} action - Kategori aksi (contoh: 'CREATE_TICKET', 'LOGIN', 'UPDATE_STATUS')
 * @param {string} description - Detail rinci aktivitas
 * @param {object} req - Object request Express (opsional, untuk mengambil IP address)
 */
exports.logActivity = async (userId, action, description, req = null) => {
  try {
    const ipAddress = req 
      ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').replace('::ffff:', '') 
      : null;

    await db.query(
      `INSERT INTO audit_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)`,
      [userId || null, action, description, ipAddress]
    );
  } catch (error) {
    console.error('⚠️ Gagal mencatat Audit Log:', error.message);
  }
};