const express = require('express');
const Form = require('../models/formModel'); // Correctly importing your Form model
const router = express.Router();

// Create or update a form entry
// Route to handle form submission
router.post('/submit', async (req, res) => {
  try {
    const form = new Form(req.body);

    // Calculate totalAmountPaid from the payments array if it exists
    if (req.body.payments && req.body.payments.length > 0) {
      const totalAmountPaid = req.body.payments.reduce((sum, payment) => sum + parseFloat(payment.paymentAmount), 0);
      form.totalAmountPaid = totalAmountPaid; // Set the total amount paid on the form
    }

    await form.save();
    res.status(201).json(form);
    
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Error saving form data', error });
  }
});


// Fetch a form by mobile number
router.get('/member/:mobileNumber', async (req, res) => {
    try {
        const form = await Form.findOne({ mobileNumber: req.params.mobileNumber });
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error('Error fetching form by mobile number:', error);
        res.status(500).json({ message: 'Error fetching form', error: error.message });
    }
});


// Fetch all forms
router.get('/forms', async (req, res) => {
    try {
        const forms = await Form.find();
        res.json(forms);
    } catch (error) {
        console.error('Error fetching forms:', error);
        res.status(500).json({ message: 'Error fetching forms', error: error.message });
    }
});
// Assuming your form model is in the models folder

// Route to get all forms
router.get('/all', async (req, res) => {
  try {
    const forms = await Form.find(); // Fetch all forms from the database
    res.json(forms); // Send the forms as a JSON response
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;


router.get('/forms/seniority/:seniorityNumber', async (req, res) => {
  try {
    const form = await Form.find({ seniorityNumber: req.params.seniorityNumber });
    
    if (!form.length) {
      return res.status(404).json({ message: 'No forms found for the given seniority number' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error fetching forms by seniority number:', error);
    res.status(500).json({ message: 'Error fetching forms', error: error.message });
  }
});



// Fetch payment details for a specific form by form ID
router.get('/forms/payments/:formId', async (req, res) => {
    try {
        const form = await Form.findById(req.params.formId).select('payments');
        if (!form) {
            return res.status(404).json({ message: 'No form found with given ID' });
        }
        res.json({ payments: form.payments });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ message: 'Error fetching payment details', error: error.message });
    }
});




module.exports = router;
        