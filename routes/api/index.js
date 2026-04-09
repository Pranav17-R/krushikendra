// ================================================
//  routes/api/index.js
//  Combines all API v1 sub-routers
// ================================================
const express = require('express');
const router  = express.Router();

router.use('/products',  require('./products'));
router.use('/enquiries', require('./enquiries'));
router.use('/dealers',   require('./dealers'));
router.use('/admin',     require('./admin'));

// ── Health-check ─────────────────────────────────
router.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({
    success:   true,
    message:   'Trishul Krushi Kendra API is running',
    db:        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    version:   'v1',
  });
});

module.exports = router;
