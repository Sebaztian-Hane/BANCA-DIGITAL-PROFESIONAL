const adminService = require('../services/admin.service');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const users = await adminService.getAllUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getUserDetails(req, res, next) {
    try {
      const { userId } = req.params;
      const userDetails = await adminService.getUserDetails(parseInt(userId));
      res.json({
        success: true,
        data: userDetails
      });
    } catch (error) {
      next(error);
    }
  }
  
  async updateUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;
      
      const user = await adminService.updateUserStatus(parseInt(userId), isActive);
      res.json({
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
  
  async updateUserBalance(req, res, next) {
    try {
      const { userId } = req.params;
      const { amount, action } = req.body;
      
      const result = await adminService.updateUserBalance(parseInt(userId), amount, action);
      res.json({
        success: true,
        message: `Balance ${action === 'add' ? 'increased' : 'decreased'} successfully`,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getSystemStats(req, res, next) {
    try {
      const stats = await adminService.getSystemStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();