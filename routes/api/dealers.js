// ================================================
//  routes/api/dealers.js
// ================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../../controllers/api/dealerApiController');
const { verifyToken } = require('../../middleware/auth');

// GET  /api/v1/dealers                           – list active dealers (public)
router.get('/',                          ctrl.getAllDealers);

// POST /api/v1/dealers/apply                     – submit dealer application (public)
router.post('/apply',                    ctrl.submitApplication);

// GET  /api/v1/dealers/applications              – list all applications (admin only)
router.get('/applications',              verifyToken, ctrl.getAllApplications);

// PUT  /api/v1/dealers/applications/:id/status   – approve/reject application (admin only)
router.put('/applications/:id/status',   verifyToken, ctrl.updateApplicationStatus);

module.exports = router;
