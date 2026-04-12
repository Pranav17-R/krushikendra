// ================================================
//  controllers/api/enquiryApiController.js
//  Farmer Enquiry REST API
// ================================================
const Enquiry = require('../../models/Enquiry');

const ok  = (res, data, msg = 'Success', status = 200) =>
  res.status(status).json({ success: true,  message: msg, ...data });
const err = (res, msg, status = 400, extra = {}) =>
  res.status(status).json({ success: false, message: msg, ...extra });

// ── POST /api/v1/enquiries ────────────────────────
// Public: farmer submits an enquiry
exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone, village, product, crop, message } = req.body;

    // Manual validation (mirrors schema rules for clear API errors)
    const errors = {};
    if (!name    || name.trim().length < 2)          errors.name    = 'Name must be at least 2 characters.';
    if (!phone   || !/^\d{10}$/.test(phone.trim()))  errors.phone   = 'Enter a valid 10-digit phone number.';
    if (!village || village.trim().length < 2)       errors.village = 'Village must be at least 2 characters.';
    if (!product || product.trim() === '')           errors.product = 'Product selection is required.';
    if (!message || message.trim().length < 10)      errors.message = 'Message must be at least 10 characters.';

    if (Object.keys(errors).length > 0)
      return err(res, 'Validation failed', 422, { errors });

    const enquiry = await Enquiry.create({
      name:    name.trim(),
      phone:   phone.trim(),
      village: village.trim(),
      product: product.trim(),
      crop:    (crop || '').trim(),
      message: message.trim(),
    });

    return ok(res, { data: enquiry }, 'Enquiry submitted successfully', 201);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.fromEntries(
        Object.entries(e.errors).map(([k, v]) => [k, v.message])
      );
      return err(res, 'Validation failed', 422, { errors });
    }
    return err(res, e.message, 500);
  }
};

// ── GET /api/v1/enquiries ─────────────────────────
// Admin: list all enquiries with optional status filter & pagination
exports.getAllEnquiries = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [enquiries, total] = await Promise.all([
      Enquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Enquiry.countDocuments(query),
    ]);

    return ok(res, {
      count: enquiries.length,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      data:  enquiries,
    });
  } catch (e) {
    return err(res, e.message, 500);
  }
};

// ── PATCH /api/v1/enquiries/:id/status ────────────
// Admin: update enquiry status
exports.updateEnquiryStatus = async (req, res) => {
  try {
    const { status, adminNote, reply } = req.body;
    const VALID = ['new', 'seen', 'replied', 'closed'];
    if (!VALID.includes(status))
      return err(res, `status must be one of: ${VALID.join(', ')}`, 422);

    const updateData = { status, ...(adminNote !== undefined && { adminNote }) };
    
    // Add reply and timestamp if status is being set to replied
    if (status === 'replied' && reply) {
      updateData.reply = reply;
      updateData.repliedAt = new Date();
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!enquiry) return err(res, 'Enquiry not found', 404);
    return ok(res, { data: enquiry }, 'Enquiry status updated');
  } catch (e) {
    return err(res, e.message, 500);
  }
};
