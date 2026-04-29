const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async login(req, res, next) {
    try {
      const { user, token } = await authService.login(req.body);
      res.json({
        success: true,
        message: 'Login successful',
        data: { user, token }
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getProfile(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();