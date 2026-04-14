// ================================================
//  models/Dealer.js – Authorized dealer listings
// ================================================
const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────
    name: {
      type:      String,
      required:  [true, 'Dealer name is required'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [120, 'Name too long'],
    },
    emoji: {
      type:    String,
      default: '🌾',
    },

    // ── Location ────────────────────────────────
    village: {
      type:     String,
      required: [true, 'Village is required'],
      trim:     true,
    },
    district: {
      type:      String,
      required:  [true, 'District is required'],
      lowercase: true,
      enum: {
        values:  ['pune', 'nashik', 'ahmednagar', 'satara', 'kolhapur', 'solapur', 'aurangabad', 'other'],
        message: 'Invalid district: {VALUE}',
      },
    },
    areas: {
      type:    [String],
      default: [],
    },

    // ── Contact ─────────────────────────────────
    contact: {
      type:     String,
      required: [true, 'Contact number is required'],
      trim:     true,
    },

    // ── Details ─────────────────────────────────
    since: {
      type:    Number,
      min:     [2000, 'Since year seems too early'],
      max:     [new Date().getFullYear(), 'Since year cannot be in the future'],
    },
    verified: {
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
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──────────────────────────────────────────
dealerSchema.index({ district: 1, status: 1 });
dealerSchema.index({ verified: 1 });

// ── Virtual: full location string ───────────────────
dealerSchema.virtual('location').get(function () {
  return `${this.village}, ${this.district.charAt(0).toUpperCase() + this.district.slice(1)}`;
});

const Dealer = mongoose.model('Dealer', dealerSchema);
module.exports = Dealer;
