// ================================================
//  routes/dealer-application.js
// ================================================
const express          = require('express');
const router           = express.Router();
const dealerController = require('../controllers/dealerController');

// GET  /become-dealer  – show application form
router.get('/',  dealerController.showApplication);

// POST /become-dealer  – submit application (saves to DB or logs mock)
router.post('/', dealerController.submitApplication);

module.exports = router;
