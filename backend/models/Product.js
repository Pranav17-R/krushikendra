// ================================================
//  models/Product.js – Mongoose schema for products
// ================================================
const mongoose = require('mongoose');

const CATEGORIES = ['organic', 'chemical', 'pesticide', 'crop-protection'];
const CATEGORY_LABELS = {
  organic:           'Organic Fertilizer',
  chemical:          'Chemical Fertilizer',
  pesticide:         'Pesticide',
  'crop-protection': 'Crop Protection',
};
const STOCK_OPTIONS = ['In Stock', 'Low Stock', 'Out of Stock'];

const productSchema = new mongoose.Schema(
  {
    // ── Identification ──────────────────────────
    name: {
      type:      String,
      required:  [true, 'Product name is required'],
      trim:      true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    slug: {
      type:     String,
      required: [true, 'Slug is required'],
      unique:   true,
      trim:     true,
      lowercase: true,
      match:    [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens'],
    },

    // ── Category ────────────────────────────────
    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum:     { values: CATEGORIES, message: 'Invalid category: {VALUE}' },
    },
    categoryLabel: {
      type: String,
      trim: true,
    },

    // ── Display ─────────────────────────────────
    emoji: {
      type:    String,
      default: '🌿',
    },
    image: {
      type:    String,   // path or URL to product image
      default: '',
    },

    // ── Details ─────────────────────────────────
    description: {
      type:      String,
      required:  [true, 'Description is required'],
      trim:      true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      min:  [0, 'Price cannot be negative'],
    },
    company: {
      type: String,
      trim: true,
    },
    benefits: {
      type:    [String],
      default: [],
    },
    tags: {
      type:    [String],
      default: [],
    },

    // ── Availability ────────────────────────────
    stock: {
      type:    String,
      enum:    { values: STOCK_OPTIONS, message: 'Invalid stock status: {VALUE}' },
      default: 'In Stock',
    },
    featured: {
      type:    Boolean,
      default: false,
    },
    status: {
      type:    String,
      enum:    ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,           // createdAt, updatedAt
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ── Pre-save: auto-set categoryLabel from category ──
productSchema.pre('save', function (next) {
  if (this.isModified('category')) {
    this.categoryLabel = CATEGORY_LABELS[this.category] || this.category;
  }
  next();
});

// ── Indexes ─────────────────────────────────────────
productSchema.index({ category: 1, status: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ featured: 1 });
// Text search index
productSchema.index(
  { name: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, tags: 5, description: 1 } }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
