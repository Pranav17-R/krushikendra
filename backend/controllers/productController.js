// ================================================
//  controllers/productController.js
// ================================================
const mongoose = require('mongoose');

// Lazy-load model only when DB is connected
function getModel() {
  return mongoose.connection.readyState === 1
    ? require('../models/Product')
    : null;
}

// ── Helper: derive category label ───────────────
const CATEGORY_LABELS = {
  organic:           'Organic Fertilizer',
  chemical:          'Chemical Fertilizer',
  pesticide:         'Pesticide',
  'crop-protection': 'Crop Protection',
};

// ── GET /products ────────────────────────────────
exports.listProducts = async (req, res, next) => {
  try {
    const filter = req.query.filter || 'all';
    const search = (req.query.search || '').trim();

    return res.render('products', {
      title:       'Our Products – Trishul Krushi Kendra',
      description: 'Browse our complete range of fertilizers, pesticides, and crop-protection products.',
      activePage:  'products',
      filter,
      search,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /products/:slug ──────────────────────────
exports.getProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const Product  = getModel();

    if (!Product) {
      return res.status(503).send('Database unavailable');
    }

    let product = await Product.findOne({ slug, status: 'active' }).lean();
    if (!product) return res.render('404', { title: 'Product Not Found', activePage: 'products', errorMsg: 'Product Not Found.' });
    
    product.categoryLabel = product.categoryLabel || CATEGORY_LABELS[product.category] || product.category;

    return res.render('product-detail', {
      title:       `${product.name} – Trishul Krushi Kendra`,
      description: product.description,
      activePage:  'products',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /products (featured, for homepage) ───────
exports.getFeatured = async () => {
  try {
    const Product = getModel();
    if (!Product) return [];
    
    const featured = await Product.find({ featured: true, status: 'active' }).limit(6).lean();
    return featured.map(p => ({
      ...p,
      categoryLabel: p.categoryLabel || CATEGORY_LABELS[p.category] || p.category,
    }));
  } catch (_) {
    return [];
  }
};
