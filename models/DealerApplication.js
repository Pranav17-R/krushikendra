// ================================================
//  models/DealerApplication.js – Dealer applications
// ================================================
const mongoose = require('mongoose');

const DISTRICTS = ['pune', 'nashik', 'ahmednagar', 'other'];
const EXPERIENCE_OPTIONS = ['0-1', '1-3', '3-5', '5+'];

const dealerApplicationSchema = new mongoose.Schema(
  {
    // ── Applicant Details ───────────────────────
    name: {
      type:      String,
      required:  [true, 'Applicant name is required'],
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
      minlength: [2,   'Village must be at least 2 characters'],
      maxlength: [100, 'Village name too long'],
    },

    // ── Business Details ────────────────────────
    shopName: {
      type:      String,
      required:  [true, 'Shop name is required'],
      trim:      true,
      minlength: [2,  'Shop name must be at least 2 characters'],
      maxlength: [120, 'Shop name too long'],
    },
    district: {
      type:     String,
      required: [true, 'District is required'],
      enum:     { values: DISTRICTS, message: 'Invalid district: {VALUE}' },
      lowercase: true,
    },
    // Service areas (alias for area, stored as array)
    area: {
      type:    [String],
      default: [],
    },
    experience: {
      type:     String,
      required: [true, 'Experience is required'],
      enum:     { values: EXPERIENCE_OPTIONS, message: 'Invalid experience option: {VALUE}' },
    },

    // ── Additional Message ───────────────────────
    message: {
      type:    String,
      trim:    true,
      default: '',
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },

    // ── Application Status ───────────────────────
    status: {
      type:    String,
      enum:    {
        values:  ['pending', 'approved', 'rejected'],
        message: 'Invalid status: {VALUE}',
      },
      default: 'pending',
    },

    // ── Admin Fields ─────────────────────────────
    reviewedBy: {
      type:    String,
      default: '',
    },
    reviewedAt: {
      type: Date,
    },
    adminNote: {
      type:    String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ── Pre-save: set reviewedAt when status changes ─────
dealerApplicationSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status !== 'pending') {
    this.reviewedAt = new Date();
  }
  next();
});

// ── Indexes ──────────────────────────────────────────
dealerApplicationSchema.index({ status: 1, createdAt: -1 });
dealerApplicationSchema.index({ district: 1 });
dealerApplicationSchema.index({ phone: 1 });

// ── Virtual: display name ────────────────────────────
dealerApplicationSchema.virtual('displayDistrict').get(function () {
  return this.district
    ? this.district.charAt(0).toUpperCase() + this.district.slice(1)
    : '';
});

const DealerApplication = mongoose.model('DealerApplication', dealerApplicationSchema);
module.exports = DealerApplication;
