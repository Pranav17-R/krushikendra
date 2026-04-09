// ================================================
//  controllers/api/authApiController.js
//  Admin Authentication API
// ================================================
const Admin = require('../../models/Admin');
const jwt = require('jsonwebtoken');

// ── Shared response helper ───────────────────────
const ok  = (res, data, msg = 'Success', status = 200) =>
  res.status(status).json({ success: true,  message: msg, ...data });
const err = (res, msg, status = 400, extra = {}) =>
  res.status(status).json({ success: false, message: msg, ...extra });

// ── POST /api/v1/admin/login ─────────────────────
// Authenticate admin and return JWT token
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return err(res, 'Please provide both username and password', 400);
    }

    // 1. Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return err(res, 'Invalid credentials', 401);
    }

    // 2. Variable password matches
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return err(res, 'Invalid credentials', 401);
    }

    // 3. Generate JWT Token
    // Default expiration: 24 hours
    const jwtSecret = process.env.JWT_SECRET || 'trishul-krushi-kendra-default-secret';
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      jwtSecret,
      { expiresIn: '24h' }
    );

    return ok(res, { token, username: admin.username }, 'Login successful', 200);

  } catch (e) {
    console.error('Login error:', e);
    return err(res, 'Server Error during login', 500);
  }
};

// ── Initialize Default Admin (called in server.js) 
// To make it beginner friendly, we'll automatically create 'admin' with 'admin123' 
// if the DB has no admins.
exports.seedDefaultAdmin = async () => {
  try {
    const count = await Admin.countDocuments();
    if (count === 0) {
      await Admin.create({
        username: 'admin',
        password: 'admin123'
      });
      console.log('✅  Default admin user created: admin / admin123');
    }
  } catch (error) {
    console.error('⚠️  Failed to seed default admin:', error.message);
  }
};
