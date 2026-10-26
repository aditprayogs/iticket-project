// backend/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(authorizeRoles('Admin', 'IT Support'));

router.get('/stats', analyticsController.getDashboardStats);

module.exports = router;