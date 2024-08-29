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

const FormSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
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
  aadharFile: { type: String },
  pancardFile: { type: String },
  photoFile: { type: String },
  affidavitFile: { type: String },
  paymentTypes: [{ type: String, required: true }],
  paidAmounts: [{ type: String, required: true }],
  pendingAmounts: [{ type: String, required: true }],
  paymentDates: [{ type: Date, required: true }],
  tids: [{ type: String }],
  bankNames: [{ type: String }],
  branches: [{ type: String }],
  commissions: [{ type: String, required: true }],
  paymentPercentages: [{ type: String, required: true }]
});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
