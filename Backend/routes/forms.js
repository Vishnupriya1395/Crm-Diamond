const express = require('express');
const Form = require('../models/formModel');

const router = express.Router();

// Submit a form
router.post('/submit', async (req, res) => {
  try {
    const formData = new Form(req.body);
    await formData.save();
    res.status(201).json({ message: 'Form submitted successfully', data: formData });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
});

// Get all forms
router.get('/all', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error('Server error while fetching forms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Server error while fetching form:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
