const transactionService = require('../services/transaction.service');

class TransactionController {
  async transfer(req, res, next) {
    try {
      const { toEmail, amount, description } = req.body;
      const result = await transactionService.transfer(
        req.user.id,
        toEmail,
        amount,
        description
      );
      res.json({
        success: true,
        message: 'Transfer successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getHistory(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      
      const history = await transactionService.getTransactionHistory(
        req.user.id,
        limit,
        offset
      );
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(
        parseInt(id),
        req.user.id
      );
      
      res.json({
        success: true,
        data: transaction
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();