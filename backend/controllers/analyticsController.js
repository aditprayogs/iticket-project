// backend/controllers/analyticsController.js
const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Total Tiket Bulan Ini
        const [monthlyTickets] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM tickets 
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

        // 2. Breakdown Tiket per Status
        const [statusCounts] = await db.query(`
      SELECT status, COUNT(*) AS count 
      FROM tickets 
      GROUP BY status
    `);

        // 3. Breakdown Tiket per Kategori (untuk Donut/Pie Chart)
        const [categoryCounts] = await db.query(`
      SELECT c.name AS category_name, COUNT(t.id) AS count
      FROM tickets t
      JOIN categories c ON t.category_id = c.id
      GROUP BY c.id, c.name
    `);

        // 4. Rata-rata Waktu Penyelesaian / SLA (dalam Jam) untuk tiket 'Resolved' / 'Closed'
        const [avgSla] = await db.query(`
      SELECT AVG(TIMESTAMPDIFF(HOUR, created_at, resolved_at)) AS avg_hours
      FROM tickets
      WHERE resolved_at IS NOT NULL
    `);

        // 5. Tren Tiket 7 Hari Terakhir (untuk Line / Bar Chart)
        const [dailyTrend] = await db.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM tickets
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

        res.json({
            total_this_month: monthlyTickets[0].total || 0,
            status_breakdown: statusCounts,
            category_breakdown: categoryCounts,
            avg_resolution_hours: Math.round(avgSla[0].avg_hours || 0),
            daily_trend: dailyTrend
        });
    } catch (error) {
        console.error('Error Analytics Stats:', error);
        res.status(500).json({ message: 'Gagal mengambil data statistik' });
    }
};