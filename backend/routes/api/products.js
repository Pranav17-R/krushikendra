// ================================================
//  routes/api/products.js
// ================================================
const express    = require('express');
const router     = express.Router();
const ctrl       = require('../../controllers/api/productApiController');
const { verifyToken } = require('../../middleware/auth');
const upload = require('../../config/cloudinary');

// GET    /api/v1/products        – list all (paginated, filterable)
router.get('/',     ctrl.getAllProducts);

// GET    /api/v1/products/:id    – get by ObjectId OR slug
router.get('/:id',  ctrl.getProductById);

// POST   /api/v1/products        – create new product (admin only)
router.post('/',    verifyToken, upload.single('image'), ctrl.createProduct);

// PUT    /api/v1/products/:id    – update product (admin only)
router.put('/:id',  verifyToken, upload.single('image'), ctrl.updateProduct);

// DELETE /api/v1/products/:id    – soft-delete (admin only)
router.delete('/:id', verifyToken, ctrl.deleteProduct);

module.exports = router;
