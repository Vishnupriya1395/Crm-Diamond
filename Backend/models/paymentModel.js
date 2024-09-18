const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  paymentAmount: { type: Number, required: true },
  paymentType: { type: String, required: true, enum: ['cash', 'cheque', 'dd', 'netbanking', 'nach/ecs'] },
  paymentDate: { type: Date, required: true },
  bankName: { type: String, required: true },
  transactionId: { type: String, required: true },
  bankBranch: { type: String, required: true },
  pendingAmount: { type: Number, required: true },  // Added pendingAmount field
  commission: { type: String, required: true, enum: ['Pending', 'Completed'] },  // Added commission field
  paymentPercentage: { type: Number, required: true },  // Added paymentPercentage field
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' } // Reference back to the Form
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;


