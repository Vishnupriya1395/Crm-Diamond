const express = require('express');
const CustomerDetails = require('../models/CustomerDetails');
const PaymentInstallment = require('../models/PaymentInstallment');
const Form = require('../models/formModel'); // Ensure Form model is imported
const router = express.Router();

// Create a new customer
router.post('/customer/create', async (req, res) => {
  try {
    const customer = new CustomerDetails(req.body);
    await customer.save();
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
});

// Fetch member data by mobile number
router.get('/member/:mobileNumber', async (req, res) => {
  try {
    const form = await Form.findOne({ mobileNumber: req.params.mobileNumber });
    if (!form) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(form);
  } catch (error) {
    console.error('Error fetching member data:', error);
    res.status(500).json({ message: 'Error fetching member data', error: error.message });
  }
});


router.get('/test', (req, res) => {
  res.json({ message: 'API is working' });
});


// Fetch forms by seniority number
router.get('/seniority/:number', async (req, res) => {
  try {
    const forms = await Form.find({ seniorityNumber: req.params.number });
    if (!forms.length) {
      return res.status(404).json({ message: 'No forms found for the given seniority number' });
    }
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms by seniority number:', error);
    res.status(500).json({ message: 'Error fetching forms by seniority number', error: error.message });
  }
});

// Create a new payment for a customer
router.post('/payment/create/:customerId', async (req, res) => {
  try {
    const customer = await CustomerDetails.findById(req.params.customerId);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const newPayment = new PaymentInstallment({
      ...req.body,
      customerId: customer._id,
    });

    await newPayment.save();

    const updatedTotalPaidAmount = (parseFloat(customer.totalPaidAmount) + parseFloat(req.body.paidAmount)).toFixed(2);
    const updatedPendingAmount = (parseFloat(customer.totalAmount) - updatedTotalPaidAmount).toFixed(2);

    customer.totalPaidAmount = updatedTotalPaidAmount;
    customer.pendingAmount = updatedPendingAmount;
    customer.paymentInstallments.push(newPayment._id);

    await customer.save();

    res.status(201).json({ message: 'Payment added successfully', newPayment });
  } catch (error) {
    console.error('Error creating payment installment:', error);
    res.status(500).json({ message: 'Error creating payment installment', error: error.message });
  }
});

// Fetch all forms
router.get('/all', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Error fetching forms', error: error.message });
  }
});

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
