const express = require('express');
const Form = require('../models/formModel'); // Ensure this is your correct Mongoose model
const upload = require('../config/multerConfig'); // Assuming you're using Multer for file handling

const router = express.Router();

// Fetch member data by phone number
router.get('/member/:phoneNumber', async (req, res) => {
  try {
    const formData = await Form.findOne(
      { mobileNumber: req.params.phoneNumber },
      { seniorityNumber: 1, firstName: 1, _id: 0 } // Fetch only needed fields
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

// Upload documentation files
router.post(
  '/upload/:seniorityNumber',
  upload.fields([
    { name: 'aadharFile', maxCount: 1 },
    { name: 'pancardFile', maxCount: 1 },
    { name: 'affidavitFile', maxCount: 1 },
    { name: 'photoFile', maxCount: 1 },
  ]),

  async (req, res) => {
    try {
      console.group(req.files);
      const { seniorityNumber } = req.params;

      const form = await Form.findOne({ seniorityNumber });

      if (!form) {
        console.log('form not found for seniority number:', seniorityNumber);
        return res.status(404).json({ message: 'Form not found' });
      }

      // Update form document with file paths
      if (req.files.aadharFile) {
        form.aadharFile = req.files.aadharFile[0].path;
      }
      if (req.files.pancardFile) {
        form.pancardFile = req.files.pancardFile[0].path;
      }
      if (req.files.affidavitFile) {
        form.affidavitFile = req.files.affidavitFile[0].path;
      }
      if (req.files.photoFile) {
        form.photoFile = req.files.photoFile[0].path;
      }

      await form.save();

      console.log('Documents uploaded successfully for seniority number:', seniorityNumber);
      res.status(200).json({ message: 'Documents uploaded successfully', data: form });
    } catch (error) {
      console.error('Error uploading documents:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;
