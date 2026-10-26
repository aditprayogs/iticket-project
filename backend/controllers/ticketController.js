// backend/controllers/ticketController.js
const db = require('../config/db');

// Helper untuk format nomor ticket unik TCK-YYYYMMDD-XXXX
const generateTicketNumber = async () => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `TCK-${dateStr}-`;

    const [rows] = await db.query(
        'SELECT ticket_number FROM tickets WHERE ticket_number LIKE ? ORDER BY id DESC LIMIT 1',
        [`${prefix}%`]
    );

    let sequence = 1;
    if (rows.length > 0) {
        const lastNum = rows[0].ticket_number.split('-')[2];
        sequence = parseInt(lastNum, 10) + 1;
    }

    return `${prefix}${String(sequence).padStart(4, '0')}`;
};

// 1. CREATE TICKET (Employee)
exports.createTicket = async (req, res) => {
    const { title, description, category_id, priority } = req.body;
    const reporter_id = req.user.id;
    const attachment_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!title || !description || !category_id) {
        return res.status(400).json({ message: 'Judul, deskripsi, dan kategori wajib diisi' });
    }

    try {
        const ticket_number = `TCK-${Date.now().toString().slice(-6)}`;

        // 1. Simpan Tiket
        const [result] = await db.query(
            `INSERT INTO tickets (ticket_number, title, description, category_id, priority, reporter_id, attachment_url)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [ticket_number, title, description, category_id, priority || 'Low', reporter_id, attachment_url]
        );

        const newTicketId = result.insertId;

        // 2. Ambil Semua User Ber-role 'IT Support' atau 'Admin'
        const [supportUsers] = await db.query(
            `SELECT id FROM users WHERE role IN ('IT Support', 'Admin')`
        );

        // 3. Loop & Insert Notifikasi Satu per Satu (Aman dari sintaks error MySQL)
        if (supportUsers.length > 0) {
            for (const u of supportUsers) {
                await db.query(
                    `INSERT INTO notifications (user_id, ticket_id, title, message) VALUES (?, ?, ?, ?)`,
                    [
                        u.id,
                        newTicketId,
                        'Tiket Baru Masuk!',
                        `Tiket #${ticket_number} (${title}) membutuhkan penanganan.`
                    ]
                );
            }
        }

        res.status(201).json({ message: 'Tiket berhasil dibuat!' });
    } catch (error) {
        console.error('Error Create Ticket:', error);
        res.status(500).json({ message: 'Gagal membuat tiket' });
    }
};

// 2. GET ALL / MY TICKETS (Multi-role)
exports.getTickets = async (req, res) => {
    try {
        let query = `
      SELECT t.*, 
             c.name AS category_name, 
             u_rep.full_name AS reporter_name,
             u_ass.full_name AS assignee_name
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN users u_rep ON t.reporter_id = u_rep.id
      LEFT JOIN users u_ass ON t.assignee_id = u_ass.id
    `;

        const queryParams = [];

        // Jika Employee, hanya tampilkan ticket milik sendiri
        if (req.user.role === 'Employee') {
            query += ' WHERE t.reporter_id = ?';
            queryParams.push(req.user.id);
        }

        query += ' ORDER BY t.created_at DESC';

        const [tickets] = await db.query(query, queryParams);
        res.json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data ticket' });
    }
};

// 3. GET TICKET DETAIL BY ID
exports.getTicketDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const [tickets] = await db.query(
            `SELECT t.*, 
              c.name AS category_name, 
              a.name AS asset_name,
              u_rep.full_name AS reporter_name,
              u_ass.full_name AS assignee_name
       FROM tickets t
       LEFT JOIN categories c ON t.category_id = c.id
       LEFT JOIN assets a ON t.asset_id = a.id
       LEFT JOIN users u_rep ON t.reporter_id = u_rep.id
       LEFT JOIN users u_ass ON t.assignee_id = u_ass.id
       WHERE t.id = ?`,
            [id]
        );

        if (tickets.length === 0) {
            return res.status(404).json({ message: 'Ticket tidak ditemukan' });
        }

        const ticket = tickets[0];

        // Otorisasi: Employee hanya boleh lihat miliknya sendiri
        if (req.user.role === 'Employee' && ticket.reporter_id !== req.user.id) {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        // Ambil komentar
        const [comments] = await db.query(
            `SELECT cm.*, u.full_name AS author_name, u.role AS author_role
       FROM comments cm
       JOIN users u ON cm.author_id = u.id
       WHERE cm.ticket_id = ? ORDER BY cm.created_at ASC`,
            [id]
        );

        // Ambil riwayat
        const [histories] = await db.query(
            `SELECT th.*, u.full_name AS actor_name
       FROM ticket_histories th
       JOIN users u ON th.actor_id = u.id
       WHERE th.ticket_id = ? ORDER BY th.created_at ASC`,
            [id]
        );

        res.json({ ...ticket, comments, histories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil detail ticket' });
    }
};

// 4. GET CATEGORIES LIST (Bantu dropdown di form create)
exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT id, name FROM categories WHERE is_active = 1');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil kategori' });
    }
};

// 5. UPDATE TICKET STATUS & ASSIGNEE (IT Support / Admin)
exports.updateTicketStatus = async (req, res) => {
    const { id } = req.params;
    const { status, resolution_notes, priority } = req.body;
    const actor_id = req.user.id;

    try {
        const [tickets] = await db.query('SELECT * FROM tickets WHERE id = ?', [id]);
        if (tickets.length === 0) {
            return res.status(404).json({ message: 'Ticket tidak ditemukan' });
        }

        const currentTicket = tickets[0];
        let updateFields = [];
        let queryParams = [];

        if (status) {
            if (status === 'Resolved' && (!resolution_notes || resolution_notes.trim() === '')) {
                return res.status(400).json({ message: 'Catatan hasil perbaikan wajib diisi' });
            }

            updateFields.push('status = ?');
            queryParams.push(status);

            if (status === 'In Progress' && !currentTicket.started_at) {
                updateFields.push('started_at = NOW()');
                if (!currentTicket.assignee_id) {
                    updateFields.push('assignee_id = ?');
                    queryParams.push(actor_id);
                }
            } else if (status === 'Resolved') {
                updateFields.push('resolved_at = NOW()');
            } else if (status === 'Closed') {
                updateFields.push('closed_at = NOW()');
            }
        }

        if (resolution_notes) {
            updateFields.push('resolution_notes = ?');
            queryParams.push(resolution_notes);
        }

        if (priority) {
            updateFields.push('priority = ?');
            queryParams.push(priority);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'Tidak ada data yang diperbarui' });
        }

        queryParams.push(id);
        await db.query(`UPDATE tickets SET ${updateFields.join(', ')} WHERE id = ?`, queryParams);

        // Kirim Notifikasi ke Pelapor (Reporter) saat Status Berubah
        if (status && status !== currentTicket.status) {
            await db.query(
                `INSERT INTO notifications (user_id, ticket_id, title, message) VALUES (?, ?, ?, ?)`,
                [
                    currentTicket.reporter_id,
                    id,
                    'Status Tiket Diperbarui',
                    `Tiket #${currentTicket.ticket_number} Anda telah diubah menjadi: ${status}`
                ]
            );
        }

        res.json({ message: 'Status ticket berhasil diperbarui' });
    } catch (error) {
        console.error('Error Update Status:', error);
        res.status(500).json({ message: 'Gagal memperbarui status ticket' });
    }
};