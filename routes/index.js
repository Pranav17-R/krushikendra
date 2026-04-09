// routes/index.js
const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res, next) => {
  try {
    let productsCount = 120;
    let dealersCount = 9;
    let farmersCount = 500;

    // Only attempt DB calls if connected
    if (mongoose.connection.readyState === 1) {
      const Product = require('../models/Product');
      const Dealer  = require('../models/Dealer');
      const Enquiry = require('../models/Enquiry');
      
      const [pc, dc, ec] = await Promise.all([
        Product.countDocuments({ status: 'active' }),
        Dealer.countDocuments({ status: 'active' }),
        Enquiry.countDocuments()
      ]);
      
      productsCount = pc > 0 ? pc : productsCount;
      dealersCount  = dc > 0 ? dc : dealersCount;
      farmersCount  = ec > 0 ? 500 + ec : farmersCount; // base 500 + live enquiries
    }

    res.render('index', {
      title: 'Trishul Krushi Kendra – Your Trusted Agricultural Partner',
      description: 'Quality fertilizers, pesticides, and farming supplies for farmers in Maharashtra.',
      activePage: 'home',
      stats: {
        products: productsCount,
        dealers: dealersCount,
        farmers: farmersCount,
        years: new Date().getFullYear() - 2012 // Dynamic years of experience
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
