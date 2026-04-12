// ================================================
//  config/cloudinary.js – Cloudinary Upload Setup
// ================================================
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Determine if Cloudinary is configured
const isConfigured = process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key_here';

let storage;

if (isConfigured) {
  // Re-configure cloudinary with .env credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Setup multer-storage-cloudinary
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'krushikendra_products', 
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], 
    },
  });
} else {
  // Fallback to local disk storage for development purposes
  console.warn('⚠️ Cloudinary is not configured. Falling back to local disk storage for uploads.');
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      cb(null, `prod-${Date.now()}.${ext}`);
    }
  });
}

// Create multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

module.exports = upload;
