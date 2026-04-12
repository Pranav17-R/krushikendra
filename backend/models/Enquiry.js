// ================================================
//  models/Enquiry.js – Farmer enquiry submissions
// ================================================
const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    // ── Farmer Details ──────────────────────────
    name: {
      type:      String,
      required:  [true, 'Farmer name is required'],
      trim:      true,
      minlength: [2,  'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    phone: {
      type:     String,
      required: [true, 'Phone number is required'],
      trim:     true,
      match:    [/^\d{10}$/, 'Phone must be a valid 10-digit number'],
    },
    village: {
      type:      String,
      required:  [true, 'Village/Town is required'],
      trim:      true,
      minlength: [2,  'Village must be at least 2 characters'],
      maxlength: [100, 'Village name too long'],
    },

    // ── Product of Interest ─────────────────────
    product: {
      type:     String,
      required: [true, 'Product selection is required'],
      trim:     true,
    },
    // Optional reference to Product document — populated when slug is known
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  'Product',
    },
    crop: {
      type:    String,
      trim:    true,
      default: '',
    },

    // ── Message ─────────────────────────────────
    message: {
      type:      String,
      required:  [true, 'Message is required'],
      trim:      true,
      minlength: [10,  'Message must be at least 10 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },

    // ── Workflow Status ──────────────────────────
    status: {
      type:    String,
      enum:    {
        values:  ['new', 'seen', 'replied', 'closed'],
        message: 'Invalid status: {VALUE}',
      },
      default: 'new',
    },

    // ── Admin Notes ──────────────────────────────
    adminNote: {
      type:    String,
      default: '',
    },

    // ── Admin Reply ───────────────────────────────
    reply: {
      type:    String,
      default: '',
    },

    // ── Reply timestamp ───────────────────────────
    repliedAt: {
      type:    Date,
    },

    // ── Submission date (alias for createdAt) ────
    date: {
      type:    Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ─────────────────────────────────────────
enquirySchema.index({ status: 1, createdAt: -1 });
enquirySchema.index({ phone: 1 });

// ── Virtual: formatted date ──────────────────────────
enquirySchema.virtual('dateFormatted').get(function () {
  return this.date
    ? this.date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '';
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
module.exports = Enquiry;
