const mongoose = require('mongoose');
const PaymentSchema = require('./paymentModel').schema; // Import the PaymentSchema

const FormSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  id: { type: Number, required: true, unique: true },
  date: { type: Date, required: true },
  name: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  mobileNumber: { type: String, required: true, unique: true },
  alternativeMobileNumber: { type: String },
  dateofbirth: { type: Date, required: true },
  emailid: { type: String, required: true },
  address: {
    flatNumber: { type: String, required: true },
    streetName: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' },
  },
  managerName: { type: String, required: true },
  executiveName: { type: String, required: true },
  seniorityNumber: { type: String, required: true },
  squareFeet: { type: String, required: true },
  totalAmount: { type: String, required: true },
  payments: [PaymentSchema], // Embed the payment subdocuments here
  aadharFile: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
pancardFile: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
photoFile: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },
affidavitFile: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' },

});

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
