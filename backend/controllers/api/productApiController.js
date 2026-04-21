// ================================================
//  controllers/api/productApiController.js
//  Full CRUD REST API for Products
// ================================================
const mongoose = require('mongoose');
const Product  = require('../../models/Product');

// ── Shared response helper ───────────────────────
const ok  = (res, data, msg = 'Success', status = 200) =>
  res.status(status).json({ success: true,  message: msg, ...data });
const err = (res, msg, status = 400, extra = {}) =>
  res.status(status).json({ success: false, message: msg, ...extra });

// Avoid Mongoose buffering timeouts when DB is disconnected.
const ensureDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    err(res, 'Database unavailable. Please try again shortly.', 503);
    return false;
  }
  return true;
};

// ── GET /api/v1/products ─────────────────────────
exports.getAllProducts = async (req, res) => {
  if (!ensureDbConnected(res)) return;
  try {
    const { filter, search, featured, page = 1, limit = 20 } = req.query;
    const query = { status: 'active' };

    if (filter && filter !== 'all') query.category = filter;
    if (featured === 'true')        query.featured  = true;

    let dbQuery;
    if (search) {
      query.$text = { $search: search };
      dbQuery = Product.find(query, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
    } else {
      dbQuery = Product.find(query).sort({ createdAt: -1 });
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      dbQuery.skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);

    return ok(res, {
      count:   products.length,
      total,
      page:    Number(page),
      pages:   Math.ceil(total / Number(limit)),
      data:    products,
    });
  } catch (e) {
    return err(res, e.message, 500);
  }
};

// ── GET /api/v1/products/:id ─────────────────────
exports.getProductById = async (req, res) => {
  if (!ensureDbConnected(res)) return;
  try {
    const { id } = req.params;
    const bySlug = !mongoose.isValidObjectId(id);
    const query  = bySlug ? { slug: id, status: 'active' }
                          : { _id: id,  status: 'active' };

    const product = await Product.findOne(query).lean();
    if (!product) return err(res, 'Product not found', 404);

    const related = await Product.find({
      category: product.category,
      status:   'active',
      _id:      { $ne: product._id },
    }).limit(3).lean();

    return ok(res, { data: product, related });
  } catch (e) {
    return err(res, e.message, 500);
  }
};

// ── POST /api/v1/products ────────────────────────
exports.createProduct = async (req, res) => {
  if (!ensureDbConnected(res)) return;
  try {
    const productData = { ...req.body };
    // If an image was uploaded, handle both Cloudinary and local disk paths
    if (req.file) {
      productData.image = req.file.path.startsWith('http') 
        ? req.file.path 
        : `/uploads/${req.file.filename}`;
    }
    
    // Handle JSON.stringify benefits and tags from frontend
    if (typeof productData.benefits === 'string') {
      try {
        productData.benefits = JSON.parse(productData.benefits);
      } catch (e) {
        // Fallback for comma-separated string
        productData.benefits = productData.benefits.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch (e) {
        // Fallback for comma-separated string
        productData.tags = productData.tags.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    
    const product = await Product.create(productData);
    return ok(res, { data: product }, 'Product created successfully', 201);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, v.message])
      );
      return err(res, 'Validation failed', 422, { errors });
    }
    if (e.code === 11000) return err(res, 'A product with this slug already exists', 409);
    return err(res, e.message, 500);
  }
};

// ── PUT /api/v1/products/:id ─────────────────────
exports.updateProduct = async (req, res) => {
  if (!ensureDbConnected(res)) return;
  try {
    const productData = { ...req.body };
    if (req.file) {
      productData.image = req.file.path.startsWith('http') 
        ? req.file.path 
        : `/uploads/${req.file.filename}`;
    }
    
    // Handle JSON.stringify benefits and tags from frontend
    if (typeof productData.benefits === 'string') {
      try {
        productData.benefits = JSON.parse(productData.benefits);
      } catch (e) {
        // Fallback for comma-separated string
        productData.benefits = productData.benefits.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch (e) {
        // Fallback for comma-separated string
        productData.tags = productData.tags.split(',').map(s => s.trim()).filter(Boolean);
      }
    }
    if (productData.price === '') {
      productData.price = null;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true }
    ).lean();
    if (!product) return err(res, 'Product not found', 404);
    return ok(res, { data: product }, 'Product updated successfully');
  } catch (e) {
    if (e.name === 'ValidationError') {
      console.error('=== Mongoose Validation Error (updateProduct) ===', e.errors);
      const errors = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, v.message])
      );
      return err(res, 'Validation failed', 422, { errors });
    }
    if (e.code === 11000) return err(res, 'A product with this slug already exists', 409);
    return err(res, e.message, 500);
  }
};

// ── DELETE /api/v1/products/:id ──────────────────
exports.deleteProduct = async (req, res) => {
  if (!ensureDbConnected(res)) return;
  try {
    // Soft-delete: set status to inactive
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'inactive' },
      { new: true }
    ).lean();
    if (!product) return err(res, 'Product not found', 404);
    return ok(res, { data: { id: product._id } }, 'Product deleted successfully');
  } catch (e) {
    return err(res, e.message, 500);
  }
};
