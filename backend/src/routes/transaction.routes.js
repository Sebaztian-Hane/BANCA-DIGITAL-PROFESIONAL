const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.verifyToken);

router.post('/transfer', transactionController.transfer);
router.get('/history', transactionController.getHistory);
router.get('/:id', transactionController.getTransaction);

module.exports = router;