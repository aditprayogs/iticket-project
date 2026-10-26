const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken);

router.get('/', notificationController.getUserNotifications);
router.patch('/read', notificationController.markAsRead);

module.exports = router;