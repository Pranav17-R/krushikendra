// ================================================
//  routes/dealers.js
// ================================================
const express           = require('express');
const router            = express.Router();
const dealerController  = require('../controllers/dealerController');

// GET /dealers   – authorized dealer list (filter by ?district=)
router.get('/', dealerController.listDealers);

module.exports = router;
