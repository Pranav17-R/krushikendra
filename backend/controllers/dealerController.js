// ================================================
//  controllers/dealerController.js
// ================================================
const mongoose = require('mongoose');

function getDealerModel()     { return mongoose.connection.readyState === 1 ? require('../models/Dealer')            : null; }
function getDealerAppModel()  { return mongoose.connection.readyState === 1 ? require('../models/DealerApplication') : null; }

// ── GET /dealers ─────────────────────────────────
exports.listDealers = async (req, res, next) => {
  try {
    const district = req.query.district || 'all';
    
    let totalDealers = 0;
    let uniqueDistricts = 3;
    const Dealer = getDealerModel();

    if (Dealer) {
      totalDealers = await Dealer.countDocuments({ status: 'active' });
      const dists = await Dealer.distinct('district', { status: 'active' });
      uniqueDistricts = dists.length > 0 ? dists.length : 3;
    }

    return res.render('dealers', {
      title:      'Authorized Dealers – Trishul Krushi Kendra',
      description:'Find a Trishul Krushi Kendra dealer near your village.',
      activePage: 'dealers',
      district,
      stats: { totalDealers, uniqueDistricts }
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /become-dealer ───────────────────────────
exports.showApplication = (req, res) => {
  res.render('become-dealer', {
    title:      'Become an Authorized Dealer – Trishul Krushi Kendra',
    description:'Apply to become an authorized dealer of Trishul Krushi Kendra products.',
    activePage: 'become-dealer',
    success:    req.query.submitted === '1',
    errors:     {},
    formData:   {},
  });
};

// ── POST /become-dealer ──────────────────────────
exports.submitApplication = async (req, res, next) => {
  const { dealerName, phone, village, district, shopName, experience, message } = req.body;
  const errors = {};

  if (!dealerName || dealerName.trim().length < 2)  errors.dealerName = 'Please enter your name.';
  if (!phone || !/^\d{10}$/.test(phone.trim()))     errors.phone      = 'Enter a valid 10-digit number.';
  if (!village || village.trim().length < 2)        errors.village    = 'Please enter your village.';
  if (!district || district.trim() === '')          errors.district   = 'Please select a district.';
  if (!shopName || shopName.trim().length < 2)      errors.shopName   = 'Please enter your shop name.';
  if (!experience || experience.trim() === '')      errors.experience = 'Please select your experience.';

  if (Object.keys(errors).length > 0) {
    return res.render('become-dealer', {
      title:      'Become an Authorized Dealer – Trishul Krushi Kendra',
      description:'Apply to become an authorized dealer.',
      activePage: 'become-dealer',
      success:    false,
      errors,
      formData:   req.body,
    });
  }

  try {
    const DealerApplication = getDealerAppModel();
    if (DealerApplication) {
      await DealerApplication.create({
        name:       dealerName.trim(),
        phone:      phone.trim(),
        village:    village.trim(),
        district:   district.toLowerCase(),
        shopName:   shopName.trim(),
        experience: experience.trim(),
        message:    (message || '').trim(),
      });
      console.log(`📋 [DB] Dealer application saved from ${dealerName}, ${village}`);
    } else {
      console.log('📋 [MOCK] Dealer Application (DB not connected):', { dealerName, phone, village, district, shopName, experience });
    }
    return res.redirect('/become-dealer?submitted=1');
  } catch (err) {
    next(err);
  }
};
