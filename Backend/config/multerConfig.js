const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage'); // Use destructuring to get GridFsStorage
const crypto = require('crypto');
const path = require('path');
require('dotenv').config(); // Ensure .env is properly configured

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI, // MongoDB URI from your .env file
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' // Collection name in MongoDB
        };
        resolve(fileInfo);
      });
    });
  }
});

// Initialize upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (jpeg, jpg, png) and PDFs are allowed'));
    }
  },
  onError: (err, next) => {
    console.error('File upload error:', err);
    next(err);
  }
});

module.exports = upload;
