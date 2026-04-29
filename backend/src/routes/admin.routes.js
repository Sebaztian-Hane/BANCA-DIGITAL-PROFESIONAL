const router = require('express').Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.verifyToken);
router.use(authMiddleware.isAdmin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.put('/users/:userId/balance', adminController.updateUserBalance);
router.get('/stats', adminController.getSystemStats);

module.exports = router;