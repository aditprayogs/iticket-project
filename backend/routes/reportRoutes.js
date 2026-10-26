// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(authorizeRoles('IT Support', 'Admin'));

router.get('/export-pdf', reportController.exportTicketsPDF);

module.exports = router;