const { verifyToken, extractTokenFromHeader } = require('../utils/generateToken');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Add user info to request object
    req.user = {
      userId: decoded.id,
      email: decoded.email,
      username: decoded.username,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user info
    next();
  }
};

module.exports = {
  authenticateToken,
  optionalAuth
};