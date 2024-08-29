const express = require('express');
const CustomerDetails = require('../models/CustomerDetails');
const PaymentInstallment = require('../models/PaymentInstallment');
const router = express.Router();

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

router.get('/all', async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ message: 'Error fetching forms', error: error.message });
  }
});


module.exports = router;
