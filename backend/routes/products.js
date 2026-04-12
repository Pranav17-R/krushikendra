// ================================================
//  routes/products.js
// ================================================
const express           = require('express');
const router            = express.Router();
const productController = require('../controllers/productController');

// GET  /products          – full catalogue (filter & search via query params)
router.get('/',      productController.listProducts);

// GET  /products/:slug    – product detail page
router.get('/:slug', productController.getProduct);

module.exports = router;
