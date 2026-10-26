// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.use(verifyToken);
router.use(authorizeRoles('Admin'));

// Stats
router.get('/stats', adminController.getAdminStats);

// Users CRUD
router.get('/users', adminController.getUsers);
router.post('/users', adminController.createUser);
router.patch('/users/:id', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);

// Categories CRUD
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Assets CRUD
router.get('/assets', adminController.getAssets);
router.post('/assets', adminController.createAsset);
router.delete('/assets/:id', adminController.deleteAsset);

module.exports = router;