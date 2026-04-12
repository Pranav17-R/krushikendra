// ================================================
//  routes/enquiry.js
// ================================================
const express            = require('express');
const router             = express.Router();
const enquiryController  = require('../controllers/enquiryController');

// GET  /enquiry   – show enquiry form
router.get('/',  enquiryController.showForm);

// POST /enquiry   – submit enquiry (saves to DB or logs mock)
router.post('/', enquiryController.submitEnquiry);

module.exports = router;
