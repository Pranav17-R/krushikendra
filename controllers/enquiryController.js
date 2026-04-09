// ================================================
//  controllers/enquiryController.js
// ================================================
const mongoose = require('mongoose');

function getEnquiryModel() {
  return mongoose.connection.readyState === 1 ? require('../models/Enquiry') : null;
}

// ── GET /enquiry ─────────────────────────────────
exports.showForm = async (req, res, next) => {
  try {
    return res.render('enquiry', {
      title:       'Farmer Enquiry – Trishul Krushi Kendra',
      description: 'Send a product enquiry to Trishul Krushi Kendra. Our team responds within 24 hours.',
      activePage:  'enquiry',
      preselect:   req.query.product || '',
      success:     req.query.submitted === '1',
      errors:      {},
      formData:    {},
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /enquiry ────────────────────────────────
exports.submitEnquiry = async (req, res, next) => {
  const { name, phone, village, product, crop, message } = req.body;
  const errors = {};

  // Validation
  if (!name    || name.trim().length < 2)          errors.name    = 'Please enter your name.';
  if (!phone   || !/^\d{10}$/.test(phone.trim()))  errors.phone   = 'Enter a valid 10-digit phone number.';
  if (!village || village.trim().length < 2)       errors.village = 'Please enter your village.';
  if (!product || product.trim() === '')           errors.product = 'Please select a product.';
  if (!message || message.trim().length < 10)      errors.message = 'Please describe your requirement (min 10 characters).';

  if (Object.keys(errors).length > 0) {
    return res.render('enquiry', {
      title:      'Farmer Enquiry – Trishul Krushi Kendra',
      description: 'Send a product enquiry.',
      activePage: 'enquiry',
      preselect:  product || '',
      success:    false,
      errors,
      formData:   req.body,
    });
  }

  try {
    const Enquiry = getEnquiryModel();
    if (Enquiry) {
      await Enquiry.create({ name: name.trim(), phone: phone.trim(), village: village.trim(), product: product.trim(), crop: (crop || '').trim(), message: message.trim() });
      console.log(`📩 [DB] Enquiry saved from ${name} (${phone}) re: ${product}`);
    } else {
      console.log('📩 [MOCK] New Enquiry (DB not connected):', { name, phone, village, product, crop, message });
    }
    return res.redirect('/enquiry?submitted=1');
  } catch (err) {
    next(err);
  }
};
