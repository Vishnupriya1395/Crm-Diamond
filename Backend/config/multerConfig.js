const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config(); // Load environment variables

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI, // MongoDB connection from your .env file
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'upload' // Bucket (collection) name in MongoDB
        };
        resolve(fileInfo);
      });
    });
  }
});
// Log file object for debugging
storage.on('file', (file) => {
  console.log('File stored in GridFS:', file);
});


// Initialize Multer middleware with file filters and error handling
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      console.error('File rejected:', file.originalname);
      cb(new Error('Only image files (jpeg, jpg, png) and PDFs are allowed'));
    }
  },
  onError: (err, next) => {
    console.error('File upload error:', err);
    next(new Error('Error occurred during file upload'));
  }
});

// Debugging: log when files are successfully uploaded to GridFS
storage.on('file', (file) => {
  console.log('File successfully stored in GridFS:', file.filename);
});

module.exports = upload;
