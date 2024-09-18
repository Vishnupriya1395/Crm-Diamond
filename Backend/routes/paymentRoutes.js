const express = require('express');
const PaymentInstallment = require('../models/PaymentInstallment');
const CustomerDetails = require('../models/CustomerDetails');
const router = express.Router();

// Route to add a new payment installment for a specific customer
router.post('/create/:customerId', async (req, res) => {
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

    // Update customer totals
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

router.post('/customer/submit', async (req, res) => {
  try {
    const customer = new CustomerDetails(req.body);
    await customer.save();
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Error creating customer', error: error.message });
  }
});

module.exports = router;

// Route to get all payments for a specific customer
router.get('/:customerId', async (req, res) => {
  try {
    const payments = await PaymentInstallment.find({ customerId: req.params.customerId });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: 'No payments found for this customer' });
    }

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

// Route to get a specific payment by its ID
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const payment = await PaymentInstallment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
});

// Route to update a specific payment by its ID
router.put('/update/:paymentId', async (req, res) => {
  try {
    const payment = await PaymentInstallment.findByIdAndUpdate(req.params.paymentId, req.body, { new: true });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
});

// Route to delete a specific payment by its ID
router.delete('/delete/:paymentId', async (req, res) => {
  try {
    const payment = await PaymentInstallment.findByIdAndDelete(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Optionally, update the customer details to remove this payment installment from their record
    await CustomerDetails.updateOne(
      { paymentInstallments: req.params.paymentId },
      { $pull: { paymentInstallments: req.params.paymentId } }
    );

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
});

module.exports = router;
