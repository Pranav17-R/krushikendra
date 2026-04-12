// ================================================
//  routes/api/enquiries.js
// ================================================
const express = require('express');
const router  = express.Router();
const ctrl    = require('../../controllers/api/enquiryApiController');
const { verifyToken } = require('../../middleware/auth');

// POST  /api/v1/enquiries           – farmer submits enquiry (public)
router.post('/',                ctrl.createEnquiry);

// GET   /api/v1/enquiries           – list all enquiries (admin only)
router.get('/',                 verifyToken, ctrl.getAllEnquiries);

// PATCH /api/v1/enquiries/:id/status – update enquiry status (admin only)
router.patch('/:id/status',     verifyToken, ctrl.updateEnquiryStatus);

module.exports = router;
