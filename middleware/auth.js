// ================================================
//  middleware/auth.js – JWT Verification Middleware
// ================================================
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  // Get token from Authorization header (Bearer <token>)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied. No token provided.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token with fallback secret for development
    const jwtSecret = process.env.JWT_SECRET || 'trishul-krushi-kendra-default-secret';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Add the user payload to the request object so next routes can use it
    req.admin = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};
