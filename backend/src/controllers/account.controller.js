const accountService = require('../services/account.service');

class AccountController {
  async getBalance(req, res, next) {
    try {
      const balance = await accountService.getBalance(req.user.id);
      res.json({
        success: true,
        data: balance
      });
    } catch (error) {
      next(error);
    }
  }
  
  async deposit(req, res, next) {
    try {
      const { amount } = req.body;
      const result = await accountService.deposit(req.user.id, amount);
      res.json({
        success: true,
        message: 'Deposit successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  async withdraw(req, res, next) {
    try {
      const { amount } = req.body;
      const result = await accountService.withdraw(req.user.id, amount);
      res.json({
        success: true,
        message: 'Withdrawal successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccountController();