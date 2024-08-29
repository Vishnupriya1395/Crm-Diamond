const mongoose = require('mongoose');

const PaymentInstallmentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerDetails', required: true },
  paymentType: { type: String, required: true },
  paidAmount: { type: String, required: true },
  pendingAmount: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  tid: { type: String },
  bankName: { type: String },
  branch: { type: String },
  commission: { type: String, required: true },
  paymentPercentage: { type: String, required: true }
});

const PaymentInstallment = mongoose.model('PaymentInstallment', PaymentInstallmentSchema);

module.exports = PaymentInstallment;
