// backend/controllers/reportController.js
const db = require('../config/db');
const PDFDocument = require('pdfkit');

exports.exportTicketsPDF = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        let query = `
      SELECT 
        t.ticket_number,
        t.title,
        c.name AS category_name,
        t.priority,
        t.status,
        u_rep.full_name AS reporter_name,
        t.created_at
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u_rep ON t.reporter_id = u_rep.id
      LEFT JOIN users u_ass ON t.assignee_id = u_ass.id
      WHERE t.status IN ('Resolved', 'Closed')
    `;
        const params = [];

        if (startDate && endDate) {
            query += ` AND DATE(t.created_at) BETWEEN ? AND ?`;
            params.push(startDate, endDate);
        }

        query += ` ORDER BY t.created_at DESC`;

        const [tickets] = await db.query(query, params);

        // Inisialisasi Dokumen PDF
        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=Laporan_ITicket.pdf`
        );

        doc.pipe(res);

        // HEADER LAPORAN
        doc.fontSize(16).text('LAPORAN TIKET IT SUPPORT', { align: 'center' });
        doc.fontSize(10).text(`Periode: ${startDate || 'Semua'} s/d ${endDate || 'Semua'}`, { align: 'center' });
        doc.moveDown(1.5);

        if (tickets.length === 0) {
            doc.fontSize(12).text('Tidak ada data tiket pada periode ini.', { align: 'center' });
        } else {
            // TABEL DATA TIKET
            tickets.forEach((t, index) => {
                const tDate = new Date(t.created_at).toLocaleDateString('id-ID');

                doc.fontSize(10).font('Helvetica-Bold')
                    .text(`${index + 1}. [${t.ticket_number}] - ${t.title}`);

                doc.fontSize(9).font('Helvetica')
                    .text(`    Kategori: ${t.category_name || '-'} | Prioritas: ${t.priority} | Status: ${t.status}`);

                doc.fontSize(9).font('Helvetica')
                    .text(`    Pelapor: ${t.reporter_name || '-'} | Tanggal: ${tDate}`);

                doc.moveDown(0.8);
            });
        }

        doc.end();
    } catch (error) {
        console.error('Error Generating PDF:', error);
        res.status(500).json({ message: 'Gagal membuat file PDF' });
    }
};