const db = require('../config/db');
const PDFDocument = require('pdfkit');

exports.exportTicketsPDF = async (req, res) => {
    const { startDate, endDate } = req.query;

    // Validasi format tanggal YYYY-MM-DD
    const isValidDate = (date) => {
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return false;
        }

        const parsedDate = new Date(`${date}T00:00:00Z`);

        return (
            !Number.isNaN(parsedDate.getTime()) &&
            parsedDate.toISOString().slice(0, 10) === date
        );
    };

    if (
        (startDate && !isValidDate(startDate)) ||
        (endDate && !isValidDate(endDate))
    ) {
        return res.status(400).json({
            message: 'Format tanggal harus YYYY-MM-DD dan merupakan tanggal yang valid.'
        });
    }

    if (startDate && endDate && startDate > endDate) {
        return res.status(400).json({
            message: 'Tanggal awal tidak boleh melebihi tanggal akhir.'
        });
    }

    try {
        // ==========================================
        // 1. QUERY DATA TIKET
        // ==========================================

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
LEFT JOIN categories c
ON t.category_id = c.id
LEFT JOIN users u_rep
ON t.reporter_id = u_rep.id
WHERE t.status IN ('Resolved', 'Closed')
    `;

        const params = [];

        if (startDate) {
            query += ` AND t.created_at >= ?`;
            params.push(`${startDate} 00:00:00`);
        }

        if (endDate) {
            query += ` AND t.created_at < DATE_ADD(?, INTERVAL 1 DAY)`;
            params.push(`${endDate} 00:00:00`);
        }

        query += ` ORDER BY t.created_at DESC`;

        const [tickets] = await db.query(query, params);

        // ==========================================
        // 2. HITUNG RINGKASAN
        // ==========================================

        const totalTickets = tickets.length;

        const resolvedTickets = tickets.filter(
            (t) => t.status === 'Resolved'
        ).length;

        const closedTickets = tickets.filter(
            (t) => t.status === 'Closed'
        ).length;

        // ==========================================
        // 3. INISIALISASI PDF
        // ==========================================

        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margins: {
                top: 45,
                bottom: 45,
                left: 30,
                right: 30
            },
            bufferPages: true,
            info: {
                Title: 'Laporan Tiket IT Support',
                Author: 'Sistem IT Support',
                Subject: 'Laporan Tiket Resolved dan Closed'
            }
        });

        const filename = 'Laporan_Tiket_IT_Support.pdf';

        res.setHeader('Content-Type', 'application/pdf');

        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${filename}"`
        );

        // Mencegah browser melakukan MIME sniffing
        res.setHeader('X-Content-Type-Options', 'nosniff');

        doc.pipe(res);

        // ==========================================
        // 4. KONFIGURASI DESAIN
        // ==========================================

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        const marginLeft = 30;
        const marginRight = 30;
        const contentWidth = pageWidth - marginLeft - marginRight;

        const colors = {
            primary: '#17365D',
            secondary: '#24476B',
            background: '#F3F6FA',
            border: '#D8E0EA',
            text: '#253247',
            muted: '#68778D',
            white: '#FFFFFF',
            green: '#16845B',
            greenLight: '#E6F5ED',
            red: '#C0392B',
            redLight: '#FCEAE8',
            orange: '#C77716',
            orangeLight: '#FFF2DC',
            gray: '#667085',
            grayLight: '#EEF1F5'
        };

        const formatDate = (date) => {
            if (!date) return '-';

            const d = new Date(date);

            if (Number.isNaN(d.getTime())) return '-';

            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).format(d);
        };

        const formatPeriodDate = (date) => {
            if (!date) return 'Semua';

            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC'
            }).format(new Date(`${date}T00:00:00Z`));
        };

        const drawRoundedBox = (
            x,
            y,
            width,
            height,
            fillColor,
            radius = 7
        ) => {
            doc.save();

            doc.roundedRect(x, y, width, height, radius)
                .fill(fillColor);

            doc.restore();
        };

        // ==========================================
        // 5. HEADER LAPORAN
        // ==========================================

        const drawHeader = () => {
            doc.save();

            doc.rect(0, 0, pageWidth, 105)
                .fill(colors.primary);

            doc.fillColor(colors.white)
                .font('Helvetica-Bold')
                .fontSize(20)
                .text('LAPORAN TIKET IT SUPPORT', marginLeft, 25, {
                    width: contentWidth,
                    align: 'center'
                });

            doc.font('Helvetica')
                .fontSize(10)
                .fillColor('#DCE6F2')
                .text(
                    'Laporan tiket dengan status Resolved dan Closed',
                    marginLeft,
                    54,
                    {
                        width: contentWidth,
                        align: 'center'
                    }
                );

            doc.fontSize(9)
                .fillColor(colors.white)
                .text(
                    `Periode: ${formatPeriodDate(startDate)} s/d ${formatPeriodDate(endDate)}`,
                    marginLeft,
                    76,
                    {
                        width: contentWidth,
                        align: 'center'
                    }
                );

            doc.restore();
        };

        // ==========================================
        // 6. RINGKASAN STATISTIK
        // ==========================================

        const drawSummary = (startY) => {
            const gap = 12;
            const cardWidth = (contentWidth - gap * 2) / 3;
            const cardHeight = 62;

            const cards = [
                {
                    title: 'TOTAL TIKET',
                    value: totalTickets,
                    color: colors.primary,
                    background: colors.background
                },
                {
                    title: 'RESOLVED',
                    value: resolvedTickets,
                    color: colors.green,
                    background: colors.greenLight
                },
                {
                    title: 'CLOSED',
                    value: closedTickets,
                    color: colors.gray,
                    background: colors.grayLight
                }
            ];

            cards.forEach((card, index) => {
                const x = marginLeft + index * (cardWidth + gap);

                drawRoundedBox(
                    x,
                    startY,
                    cardWidth,
                    cardHeight,
                    card.background
                );

                doc.fillColor(card.color)
                    .font('Helvetica-Bold')
                    .fontSize(9)
                    .text(card.title, x + 12, startY + 10);

                doc.fontSize(21)
                    .text(String(card.value), x + 12, startY + 27);
            });

            return startY + cardHeight + 25;
        };

        // ==========================================
        // 7. KONFIGURASI TABEL
        // ==========================================

        const columns = [
            { key: 'no', label: 'NO', width: 30 },
            { key: 'ticket', label: 'NO. TIKET', width: 88 },
            { key: 'title', label: 'JUDUL TIKET', width: 170 },
            { key: 'category', label: 'KATEGORI', width: 105 },
            { key: 'priority', label: 'PRIORITAS', width: 68 },
            { key: 'status', label: 'STATUS', width: 75 },
            { key: 'reporter', label: 'PELAPOR', width: 105 },
            { key: 'date', label: 'TANGGAL', width: 96 }
        ];

        // Sesuaikan lebar kolom agar selalu muat di halaman
        const totalColumnWidth = columns.reduce(
            (sum, column) => sum + column.width,
            0
        );

        const widthScale = contentWidth / totalColumnWidth;

        columns.forEach((column) => {
            column.width *= widthScale;
        });

        const tableWidth = columns.reduce(
            (sum, column) => sum + column.width,
            0
        );

        const tableHeaderHeight = 30;
        const cellPadding = 6;
        const minimumRowHeight = 34;

        const drawTableHeader = (y) => {
            doc.save();

            doc.rect(marginLeft, y, tableWidth, tableHeaderHeight)
                .fill(colors.secondary);

            let x = marginLeft;

            columns.forEach((column) => {
                doc.fillColor(colors.white)
                    .font('Helvetica-Bold')
                    .fontSize(8)
                    .text(
                        column.label,
                        x + cellPadding,
                        y + 10,
                        {
                            width: column.width - cellPadding * 2,
                            align: 'left',
                            lineBreak: false
                        }
                    );

                x += column.width;
            });

            doc.restore();

            return y + tableHeaderHeight;
        };

        const getPriorityStyle = (priority) => {
            const value = String(priority || '').toLowerCase();

            if (['critical', 'high'].includes(value)) {
                return {
                    color: colors.red,
                    background: colors.redLight
                };
            }

            if (value === 'medium') {
                return {
                    color: colors.orange,
                    background: colors.orangeLight
                };
            }

            if (value === 'low') {
                return {
                    color: colors.green,
                    background: colors.greenLight
                };
            }

            return {
                color: colors.gray,
                background: colors.grayLight
            };
        };

        const getStatusStyle = (status) => {
            if (status === 'Resolved') {
                return {
                    color: colors.green,
                    background: colors.greenLight
                };
            }

            return {
                color: colors.gray,
                background: colors.grayLight
            };
        };

        const drawBadge = (
            text,
            x,
            y,
            width,
            height,
            style
        ) => {
            const badgeWidth = Math.min(width - 8, 66);
            const badgeX = x + (width - badgeWidth) / 2;
            const badgeY = y + (height - 17) / 2;

            doc.save();

            doc.roundedRect(
                badgeX,
                badgeY,
                badgeWidth,
                17,
                4
            ).fill(style.background);

            doc.fillColor(style.color)
                .font('Helvetica-Bold')
                .fontSize(7)
                .text(
                    String(text || '-').toUpperCase(),
                    badgeX + 2,
                    badgeY + 5,
                    {
                        width: badgeWidth - 4,
                        align: 'center',
                        lineBreak: false,
                        ellipsis: true
                    }
                );

            doc.restore();
        };

        // ==========================================
        // 8. GAMBAR BARIS TABEL
        // ==========================================

        const drawTableRow = (ticket, index, y) => {
            const values = [
                String(index + 1),
                ticket.ticket_number || '-',
                ticket.title || '-',
                ticket.category_name || '-',
                ticket.priority || '-',
                ticket.status || '-',
                ticket.reporter_name || '-',
                formatDate(ticket.created_at)
            ];

            doc.font('Helvetica')
                .fontSize(8);

            // Hitung tinggi baris berdasarkan isi kolom.
            let rowHeight = minimumRowHeight;

            columns.forEach((column, i) => {
                if (['priority', 'status'].includes(column.key)) {
                    return;
                }

                const textHeight = doc.heightOfString(
                    values[i],
                    {
                        width: column.width - cellPadding * 2,
                        font: 'Helvetica',
                        fontSize: 8,
                        lineGap: 1
                    }
                );

                rowHeight = Math.max(
                    rowHeight,
                    textHeight + cellPadding * 2
                );
            });

            // Latar baris selang-seling.
            doc.save();

            doc.rect(marginLeft, y, tableWidth, rowHeight)
                .fill(index % 2 === 0 ? '#FFFFFF' : '#F6F8FB');

            // Garis pemisah kolom dan baris.
            doc.strokeColor(colors.border)
                .lineWidth(0.5)
                .rect(marginLeft, y, tableWidth, rowHeight)
                .stroke();

            let x = marginLeft;

            columns.forEach((column, i) => {
                if (i > 0) {
                    doc.moveTo(x, y)
                        .lineTo(x, y + rowHeight)
                        .stroke();
                }

                const value = values[i];

                if (column.key === 'priority') {
                    drawBadge(
                        value,
                        x,
                        y,
                        column.width,
                        rowHeight,
                        getPriorityStyle(value)
                    );
                } else if (column.key === 'status') {
                    drawBadge(
                        value,
                        x,
                        y,
                        column.width,
                        rowHeight,
                        getStatusStyle(value)
                    );
                } else {
                    doc.fillColor(
                        column.key === 'no'
                            ? colors.muted
                            : colors.text
                    );

                    doc.font(
                        column.key === 'ticket'
                            ? 'Helvetica-Bold'
                            : 'Helvetica'
                    );

                    doc.fontSize(8);

                    const textHeight = doc.heightOfString(
                        value,
                        {
                            width: column.width - cellPadding * 2,
                            fontSize: 8,
                            font: column.key === 'ticket'
                                ? 'Helvetica-Bold'
                                : 'Helvetica',
                            lineGap: 1
                        }
                    );

                    doc.text(
                        value,
                        x + cellPadding,
                        y + Math.max(
                            cellPadding,
                            (rowHeight - textHeight) / 2
                        ),
                        {
                            width: column.width - cellPadding * 2,
                            lineGap: 1
                        }
                    );
                }

                x += column.width;
            });

            // Garis bawah baris.
            doc.moveTo(marginLeft, y + rowHeight)
                .lineTo(marginLeft + tableWidth, y + rowHeight)
                .stroke();

            doc.restore();

            return y + rowHeight;
        };

        // ==========================================
        // 9. GAMBAR HALAMAN PERTAMA
        // ==========================================

        drawHeader();

        let currentY = drawSummary(120);

        doc.fillColor(colors.primary)
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('DETAIL TIKET', marginLeft, currentY);

        currentY += 23;

        currentY = drawTableHeader(currentY);

        if (tickets.length === 0) {
            drawRoundedBox(
                marginLeft,
                currentY + 15,
                contentWidth,
                55,
                colors.background
            );

            doc.fillColor(colors.muted)
                .font('Helvetica')
                .fontSize(10)
                .text(
                    'Tidak ada data tiket pada periode yang dipilih.',
                    marginLeft + 10,
                    currentY + 36,
                    {
                        width: contentWidth - 20,
                        align: 'center'
                    }
                );
        } else {
            tickets.forEach((ticket, index) => {
                doc.font('Helvetica').fontSize(8);

                // Periksa perkiraan tinggi baris sebelum menggambarnya.
                const values = [
                    String(index + 1),
                    ticket.ticket_number || '-',
                    ticket.title || '-',
                    ticket.category_name || '-',
                    ticket.priority || '-',
                    ticket.status || '-',
                    ticket.reporter_name || '-',
                    formatDate(ticket.created_at)
                ];

                let estimatedHeight = minimumRowHeight;

                columns.forEach((column, i) => {
                    if (
                        column.key === 'priority' ||
                        column.key === 'status'
                    ) {
                        return;
                    }

                    const height = doc.heightOfString(
                        values[i],
                        {
                            width: column.width - cellPadding * 2,
                            fontSize: 8,
                            font: column.key === 'ticket'
                                ? 'Helvetica-Bold'
                                : 'Helvetica',
                            lineGap: 1
                        }
                    );

                    estimatedHeight = Math.max(
                        estimatedHeight,
                        height + cellPadding * 2
                    );
                });

                const footerSpace = 35;
                const availableBottom = pageHeight - 45 - footerSpace;

                // Buat halaman baru jika baris tidak muat.
                if (currentY + estimatedHeight > availableBottom) {
                    doc.addPage();

                    drawHeader();

                    currentY = 125;

                    doc.fillColor(colors.primary)
                        .font('Helvetica-Bold')
                        .fontSize(12)
                        .text('DETAIL TIKET (LANJUTAN)', marginLeft, currentY);

                    currentY += 23;

                    currentY = drawTableHeader(currentY);
                }

                currentY = drawTableRow(ticket, index, currentY);
            });
        }

        // ==========================================
        // 10. FOOTER DAN NOMOR HALAMAN
        // ==========================================

        const range = doc.bufferedPageRange();

        for (let i = 0; i < range.count; i++) {
            doc.switchToPage(range.start + i);

            doc.save();

            const footerY = pageHeight - 30;

            doc.strokeColor(colors.border)
                .lineWidth(0.7)
                .moveTo(marginLeft, footerY - 8)
                .lineTo(pageWidth - marginRight, footerY - 8)
                .stroke();

            doc.font('Helvetica')
                .fontSize(8)
                .fillColor(colors.muted)
                .text(
                    'Laporan IT Support | Dokumen dibuat otomatis oleh sistem',
                    marginLeft,
                    footerY,
                    {
                        width: contentWidth * 0.7,
                        lineBreak: false
                    }
                );

            doc.text(
                `Halaman ${i + 1} dari ${range.count}`,
                marginLeft + contentWidth * 0.7,
                footerY,
                {
                    width: contentWidth * 0.3,
                    align: 'right',
                    lineBreak: false
                }
            );

            doc.restore();
        }

        // ==========================================
        // 11. SELESAIKAN PDF
        // ==========================================

        doc.end();

    } catch (error) {
        console.error('Error Generating PDF:', error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: 'Gagal membuat file PDF.'
            });
        }

        // Jika PDF sudah mulai dikirim, hentikan respons.
        res.destroy(error);
    }
};