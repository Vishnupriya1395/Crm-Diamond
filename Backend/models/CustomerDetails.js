const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  flatNumber: { type: String, required: true },
  streetName: { type: String, required: true },
  area: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' }
});

const CustomerDetailsSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  customerId: { type: Number, required: true, unique: true }, // Unique customer ID
  date: { type: Date, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  alternativeMobileNumber: { type: String },
  dateofbirth: { type: Date, required: true },
  emailid: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  managerName: { type: String, required: true },
  executiveName: { type: String, required: true },
  seniorityNumber: { type: String, required: true },
  squareFeet: { type: String, required: true },
  totalAmount: { type: String, required: true },
  totalPaidAmount: { type: String, default: '0' }, // Total of all payments made
  pendingAmount: { type: String, default: '0' }, // Amount still pending
  paymentInstallments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentInstallment' }] // Reference to PaymentInstallments
});

const CustomerDetails = mongoose.model('CustomerDetails', CustomerDetailsSchema);

module.exports = CustomerDetails;
