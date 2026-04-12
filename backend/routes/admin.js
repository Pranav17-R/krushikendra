// ================================================
//  routes/admin.js
// ================================================
const express         = require('express');
const router          = express.Router();
const adminController = require('../controllers/adminController');

// TODO: Protect with auth middleware before going to production
// const { requireAuth } = require('../middleware/auth');
// router.use(requireAuth);

// GET /admin/login – serve login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Admin Login – Trishul Krushi Kendra' });
});

// GET /admin  – dashboard with live DB stats
router.get('/', adminController.showDashboard);

module.exports = router;
