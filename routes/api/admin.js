// ================================================
//  routes/api/admin.js
//  Auth routes for admin
// ================================================
const express = require('express');
const router  = express.Router();
const authCtrl = require('../../controllers/api/authApiController');

// POST /api/v1/admin/login
router.post('/login', authCtrl.login);

module.exports = router;
