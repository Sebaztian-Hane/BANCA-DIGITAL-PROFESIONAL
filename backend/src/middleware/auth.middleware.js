const jwt = require('jsonwebtoken');

class AuthMiddleware {
  verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
  }
  
  isAdmin(req, res, next) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  }
  
  isClient(req, res, next) {
    if (req.user.role !== 'CLIENT') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Client privileges required.'
      });
    }
    next();
  }
}

module.exports = new AuthMiddleware();