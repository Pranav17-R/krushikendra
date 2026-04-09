// ================================================
//  controllers/api/dealerApiController.js
//  Dealer listings + Dealer Application REST API
// ================================================
const Dealer            = require('../../models/Dealer');
const DealerApplication = require('../../models/DealerApplication');

const ok  = (res, data, msg = 'Success', status = 200) =>
  res.status(status).json({ success: true,  message: msg, ...data });
const err = (res, msg, status = 400, extra = {}) =>
  res.status(status).json({ success: false, message: msg, ...extra });

// ── GET /api/v1/dealers ───────────────────────────
// Public: list active dealers (filter by ?district=)
exports.getAllDealers = async (req, res) => {
  try {
    const { district } = req.query;
    const query = { status: 'active' };
    if (district && district !== 'all') query.district = district.toLowerCase();

    const dealers = await Dealer.find(query)
      .sort({ verified: -1, name: 1 })
      .lean();

    return ok(res, { count: dealers.length, data: dealers });
  } catch (e) {
    return err(res, e.message, 500);
  }
};

// ── POST /api/v1/dealers/apply ────────────────────
// Public: farmer applies to become a dealer
exports.submitApplication = async (req, res) => {
  try {
    const { name, phone, village, shopName, district, area, experience, message } = req.body;

    const errors = {};
    if (!name     || name.trim().length < 2)         errors.name       = 'Name is required (min 2 chars).';
    if (!phone    || !/^\d{10}$/.test(phone.trim())) errors.phone      = 'Enter a valid 10-digit phone number.';
    if (!village  || village.trim().length < 2)      errors.village    = 'Village is required.';
    if (!shopName || shopName.trim().length < 2)     errors.shopName   = 'Shop name is required.';
    if (!district || district.trim() === '')         errors.district   = 'District is required.';
    if (!experience || experience.trim() === '')     errors.experience = 'Experience selection is required.';

    if (Object.keys(errors).length > 0)
      return err(res, 'Validation failed', 422, { errors });

    const application = await DealerApplication.create({
      name:       name.trim(),
      phone:      phone.trim(),
      village:    village.trim(),
      shopName:   shopName.trim(),
      district:   district.toLowerCase().trim(),
      area:       Array.isArray(area) ? area : (area ? [area] : []),
      experience: experience.trim(),
      message:    (message || '').trim(),
    });

    return ok(res, { data: application }, 'Application submitted successfully', 201);
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

// ── GET /api/v1/dealers/applications ─────────────
// Admin: list dealer applications with optional status filter
exports.getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [applications, total] = await Promise.all([
      DealerApplication.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      DealerApplication.countDocuments(query),
    ]);

    return ok(res, {
      count: applications.length,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      data:  applications,
    });
  } catch (e) {
    return err(res, e.message, 500);
  }
};

// ── PUT /api/v1/dealers/applications/:id/status ───
// Admin: approve or reject a dealer application
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, reviewedBy, adminNote } = req.body;
    const VALID = ['pending', 'approved', 'rejected'];

    if (!VALID.includes(status))
      return err(res, `status must be one of: ${VALID.join(', ')}`, 422);

    const application = await DealerApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(reviewedBy !== undefined && { reviewedBy }),
        ...(adminNote  !== undefined && { adminNote }),
      },
      { new: true, runValidators: true }
    );

    if (!application) return err(res, 'Application not found', 404);

    // If approved → auto-create a Dealer record
    if (status === 'approved') {
      const exists = await Dealer.findOne({ contact: application.phone });
      if (!exists) {
        await Dealer.create({
          name:     application.name,
          village:  application.village,
          district: application.district,
          contact:  application.phone,
          areas:    application.area,
          verified: false,
          status:   'active',
        });
      }
    }

    return ok(res, { data: application.toJSON() }, `Application ${status}`);
  } catch (e) {
    return err(res, e.message, 500);
  }
};
