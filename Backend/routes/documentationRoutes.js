const express = require('express');
const mongoose = require('mongoose'); // Make sure mongoose is required
const Form = require('../models/formModel'); // Ensure this is your correct Mongoose model
const upload = require('../config/multerConfig'); // Assuming you're using Multer for file handling

const router = express.Router();

// Fetch member data by phone number
router.get('/member/:mobileNumber', async (req, res) => {
  console.log(`Fetching data for phone number: ${req.params.phoneNumber}`);
  try {
    const formData = await Form.findOne(
      { mobileNumber: req.params.mobileNumber },
      { seniorityNumber: 1, name: 1, _id: 0 } // Fetch only needed fields
    );

    if (!formData) {
      return res.status(404).json({ message: 'Member not found' });
    }
    console.log('Member data found:', formData);
    res.json(formData);
  } catch (error) {
    console.error('Error fetching member data:', error);
    res.status(500).json({ message: 'Error fetching member data', error: error.message });
  }
});

// Download files from MongoDB GridFS
// Route to download file from MongoDB GridFS by file ID
router.get('/file/:id', async (req, res) => {
  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'upload' // Ensure consistent bucket name
    });
    
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(fileId);

    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('end', () => {
      res.end();
    });

    downloadStream.on('error', (err) => {
      res.status(404).send('File not found');
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).send('Error fetching file');
  }
});


// Upload documentation files
router.post( '/upload/:mobileNumber',
  upload.fields([
    { name: 'aadharFile', maxCount: 1 },
    { name: 'pancardFile', maxCount: 1 },
    { name: 'affidavitFile', maxCount: 1 },
    { name: 'photoFile', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log('Files uploaded:', req.files);
      
      const { mobileNumber } = req.params;
      const form = await Form.findOne({ mobileNumber });

      if (!form) {
        console.log('Form not found for mobile number:', mobileNumber);
        return res.status(404).json({ message: 'Form not found' });
      }

      // Update form document with file paths
      if (req.files.aadharFile) {
        form.aadharFile = req.files.aadharFile[0].id;
      }
      if (req.files.pancardFile) {
        form.pancardFile = req.files.pancardFile[0].id;
      }
      if (req.files.affidavitFile) {
        form.affidavitFile = req.files.affidavitFile[0].id;
      }
      if (req.files.photoFile) {
        form.photoFile = req.files.photoFile[0].id;
      }

      await form.save();

      console.log('Documents uploaded successfully for mobile number:', mobileNumber);
      res.status(200).json({ message: 'Documents uploaded successfully', data: form });
    } catch (error) {
      console.error('Error uploading documents:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);


module.exports = router;
