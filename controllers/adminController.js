// ================================================
//  controllers/adminController.js
// ================================================
const mongoose = require('mongoose');

function isConnected() { return mongoose.connection.readyState === 1; }

// ── GET /admin ───────────────────────────────────
exports.showDashboard = async (req, res, next) => {
  try {
    let stats = { products: 0, enquiries: 0, dealers: 0, applications: 0 };

    if (isConnected()) {
      const Product          = require('../models/Product');
      const Enquiry          = require('../models/Enquiry');
      const Dealer           = require('../models/Dealer');
      const DealerApplication = require('../models/DealerApplication');

      const [products, enquiries, dealers, applications] = await Promise.all([
        Product.countDocuments({ status: { $ne: 'inactive' } }),
        Enquiry.countDocuments(),
        Dealer.countDocuments({ status: 'active' }),
        DealerApplication.countDocuments({ status: 'pending' }),
      ]);

      stats = { products, enquiries, dealers, applications };
    } 

    return res.render('admin', {
      title:              'Admin Dashboard – Trishul Krushi Kendra',
      activePage:         'admin',
      stats,
    });
  } catch (err) {
    next(err);
  }
};
