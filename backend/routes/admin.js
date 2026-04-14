// ================================================
//  routes/admin.js
// ================================================
const express         = require('express');
const router          = express.Router();
const adminController = require('../controllers/adminController');

const { requireAdmin } = require('../middleware/auth');

// GET /admin/login – serve login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Admin Login – Trishul Krushi Kendra' });
});

// GET /admin  – dashboard with live DB stats
router.get('/', requireAdmin, adminController.showDashboard);

// GET /admin/logout – clear cookie and redirect
router.get('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
});

module.exports = router;
