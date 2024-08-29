const express = require('express');
const Payment = require('../models/paymentModel'); // Assuming you have a Payment model
const router = express.Router();

// Submit payment data
router.post('/submit', async (req, res) => {
  try {
    const paymentData = new Payment(req.body);
    await paymentData.save();
    console.log('Payment submitted successfully:', paymentData); // Log the payment data
    res.status(201).json({ message: 'Payment submitted successfully', data: paymentData });
  } catch (error) {
    console.error('Error submitting payment:', error);
    res.status(500).json({ message: 'Error submitting payment', error: error.message });
  }
});

module.exports = router;
