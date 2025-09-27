const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const secret = process.env.JWT_SECRET;
    return jwt.sign(
        { 
            email: user.email, 
            id: user._id, 
            username: user.username
        },
        secret,
        { expiresIn: '365d' }
    );
};

// Verify token
const verifyToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET;
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Extract token from Authorization header
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};

module.exports = { 
    generateToken, 
    verifyToken, 
    extractTokenFromHeader 
};
