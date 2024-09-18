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

const paymentSchema = new mongoose.Schema({
  payemntDate: {type: String, required: true},
  paymentType: {type: String, required: true },
  paidAmount : { type: String, required: true },
  tid : {type: String, required: true},
  bankname : {type: String, required: true},
  branch: { type: String, required: true},
});

const nameSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const FormSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  date: { type: Date, required: true },
  name: {type: nameSchema, required: true},
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
  pendingAmounts: { type: String, required: true },
  aadharFile: { type: String },
  pancardFile: { type: String },
  photoFile: { type: String },
  affidavitFile: { type: String },
  commissions: { type: String, required: true },
  paymentPercentages: { type: String, required: true },
  payments: [paymentSchema]
});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
