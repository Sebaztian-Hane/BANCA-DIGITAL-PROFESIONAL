const router = require('express').Router();
const accountController = require('../controllers/account.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware.verifyToken);

router.get('/balance', accountController.getBalance);
router.post('/deposit', accountController.deposit);
router.post('/withdraw', accountController.withdraw);

module.exports = router;