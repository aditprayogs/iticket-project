// backend/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(verifyToken);

// WAJIB: Tempatkan route spesifik ini SEBELUM route /:id
router.get('/categories', ticketController.getCategories);
// router.post('/', upload.single('attachment'), ticketController.createTicket);

router.get('/', ticketController.getTickets);
router.get('/:id', ticketController.getTicketDetail);
// router.post('/', authorizeRoles('Employee', 'Admin'), ticketController.createTicket);
// GABUNGKAN MIDDLEWARE MENJADI SATU BARIS
router.post(
    '/',
    authorizeRoles('Employee', 'Admin'),
    upload.single('attachment'),
    ticketController.createTicket
);


// Tambahkan di ticketRoutes.js
router.patch('/:id/status', authorizeRoles('IT Support', 'Admin'), ticketController.updateTicketStatus);

module.exports = router;