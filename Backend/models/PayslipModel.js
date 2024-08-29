const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  projectName: String,
  id: { type: String, required: true },
  date: { type: Date, required: true },
  firstName: String,
  lastName: String,
  mobileNumber: String,
  alternativeMobileNumber: String,
  dateofbirth: { type: Date, required: true },
  emailid: String,
  address: String,
  executiveName: String,
  managerName: String,
  seniorityNumber: String,
  squareFeet: String,
  totalAmount: String,
  paymentType: String,
  paidAmount: String,
  pendingAmount: String,
  tid: String,
  bankName: String,
  branch: String,
  paymentPercentage: String,
  commission: String,
  aadhar: String,
  panCard: String,
  photo: String,
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
