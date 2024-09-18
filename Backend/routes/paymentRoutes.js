const express = require('express');
const router = express.Router();
const Form = require('../models/formModel');
const Payment = require('../models/paymentModel');

// Fetch data by mobile number
router.get('/member/:mobileNumber', async (req, res) => {
  try {
    console.log(`Fetching data for mobile number: ${req.params.mobileNumber}`);
    const formData = await Form.findOne({ mobileNumber: req.params.mobileNumber });
    if (!formData) {
      console.log('Member not found');
      return res.status(404).json({ message: 'Member not found' });
    }
    console.log('Data found:', formData);
    res.json(formData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: error.message }); 
  }
});

router.post('/forms/:mobileNumber/payments', async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    console.log(`Received payment data for mobile number: ${mobileNumber}`, req.body);

    const form = await Form.findOne({ mobileNumber });
    if (!form) {
      console.log('Form not found for mobile number:', mobileNumber);
      return res.status(404).json({ message: 'Form not found' });
    }

    const payment = new Payment({
      paymentAmount: req.body.paymentAmount,
      paymentDate: req.body.paymentDate,
      paymentType: req.body.paymentType,
      bankName: req.body.bankName,
      transactionId: req.body.transactionId,
      branchName: req.body.branchName,
      pendingAmount: req.body.pendingAmount, // Added pendingAmount field
      commission: req.body.commission, // Added commission field
      paymentPercentage: req.body.paymentPercentage, // Added paymentPercentage field
      customerId: form._id,
      form: form._id,
    });

    console.log('Saving new payment:', payment);  // Log the payment before saving
    await payment.save();

    form.payments.push(payment._id); // Push the payment ID to the payments array in the form
    console.log('Updating form with new payment ID:', form.payments);  // Log updated payments array

    await form.save(); // Save the form with the updated payments array
    console.log('Form updated successfully:', form);  // Confirm successful save of the form

    res.status(201).json(payment);// Return the newly created payment
    
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/forms/:id', async (req, res) => {
  try {
    const form = await Form.findOne({ id: req.params.id });
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching form by ID:', error);
    res.status(500).json({ message: 'Error fetching form', error: error.message });
  }
});






module.exports = router;
