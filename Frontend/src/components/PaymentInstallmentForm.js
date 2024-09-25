import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PaymentInstallmentForm.css';


const PaymentInstallmentForm = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    id:'',
    name: {
      firstName: '',
      lastName: '',
    },
    squareFeet: '',
    totalAmount: '', // Ensure this will be a number without commas later
    payments: [], // Array to hold multiple payment objects
  });
3

  const [newPayment, setNewPayment] = useState({
    paymentAmount: '',
    paymentType: '',
    paymentDate: '',
    bankName: '',
    branchName: '',
    transactionId: '',
    commission: '',
    paymentPercentage: '',
    pendingAmount: '',
  });


  const [error, setError] = useState('');


  const fetchDataByMobileNumber = async (mobileNumber) => {
    try {
      const response = await axios.get(`http://diamondcrown.org/api/payments/member/${mobileNumber}`);
      if (response.status === 200) {
        const totalPaidAmount = response.data.payments.reduce((total, payment) => total + parseInt(payment.paymentAmount, 10), 0);
        
        setFormData((prevData) => ({
          ...prevData,
          projectName: response.data.projectName,
          id: response.data.id,  // Ensure the ID is being set here
          name: {
            firstName: response.data.name.firstName,
            lastName: response.data.name.lastName,
          },
          squareFeet: response.data.squareFeet,
          totalAmount: response.data.totalAmount.replace(/,/g, ''), // Remove commas if present
          payments: response.data.payments,
          pendingAmount: (parseInt(response.data.totalAmount, 10) - totalPaidAmount).toFixed(2),
          paymentPercentage: ((totalPaidAmount / parseInt(response.data.totalAmount, 10)) * 100).toFixed(2) + '%',
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Mobile Number you entered is not valid');
      setError('Error fetching data. Please check the console for details.');
    }
  };


  // Update the percentage and pending amount when the paidAmount changes

  // Update the percentage and pending amount when the paidAmount changes
const handlePaidAmountChange = (e) => {
  const paidAmount = parseInt(e.target.value, 10) || 0;
  const totalAmount = parseInt(formData.totalAmount, 10) || 0; // Ensure totalAmount is a number
  const totalPaidAmount = formData.payments.reduce((total, payment) => total + parseInt(payment.paymentAmount, 10), 0); // Sum of previous payments

  // Calculate new total paid amount including this new payment
  const newTotalPaidAmount = totalPaidAmount + paidAmount;

  // Avoid calculations if totalAmount is not a valid number
  if (isNaN(totalAmount) || totalAmount === 0) {
    setNewPayment((prevData) => ({
      ...prevData,
      paymentAmount: e.target.value, // Still update the paid amount field
      paymentPercentage: '0%',
      pendingAmount: totalAmount.toFixed(2),
    }));
    return;
  }

  // Calculate payment percentage and pending amount
  const paymentPercentage = ((newTotalPaidAmount / totalAmount) * 100).toFixed(2);
  const pendingAmount = (totalAmount - newTotalPaidAmount).toFixed(2);

  setNewPayment((prevData) => ({
    ...prevData,
    paymentAmount: e.target.value, // Update paidAmount in the state
    paymentPercentage: paymentPercentage + '%', // Add % symbol
    pendingAmount: pendingAmount,
  }));
};

// Handle payment submission
const handleAddPayment = async (e) => {
  e.preventDefault(); // Prevent form submission

  const paidAmount = parseInt(newPayment.paymentAmount, 10) || 0;
  const totalAmount = parseInt(formData.totalAmount, 10) || 0;
  const totalPaidAmount = formData.payments.reduce((total, payment) => total + parseInt(payment.paymentAmount, 10), 0); // Sum of previous payments

  // Avoid submitting if totalAmount is invalid
  if (isNaN(totalAmount) || totalAmount === 0) {
    setError('Total amount is invalid. Please check the fetched data.');
    return;
  }

  const paymentData = {
    paymentAmount: newPayment.paymentAmount,
    paymentType: newPayment.paymentType,
    paymentDate: newPayment.paymentDate,
    bankName: newPayment.bankName,
    transactionId: newPayment.transactionId,
    branchName: newPayment.branchName,
    commission: newPayment.commission,
    paymentPercentage: ((totalPaidAmount + paidAmount) / totalAmount * 100).toFixed(2), // Payment percentage
    pendingAmount: (totalAmount - (totalPaidAmount + paidAmount)).toFixed(2), // Pending amount
    customerId: formData.id, // Link this payment to the customer
  };

  console.log('Received new payment data:', paymentData);

  try {
    // POST to add payment to the backend
    const response = await axios.post(`http://diamondcrown.org/api/payments/forms/${mobileNumber}/payments`, paymentData);

    if (response.status === 201) {
      // Append new payment to payments array in formData
      setFormData((prevData) => ({
        ...prevData,
        payments: [...prevData.payments, response.data], // Add new payment to the array
      }));

      // Reset the newPayment fields after successful submission
      setNewPayment({
        paymentAmount: '',
        paymentType: '',
        paymentDate: '',
        bankName: '',
        branchName: '',
        transactionId: '',
        commission: '',
        paymentPercentage: '',
        pendingAmount: '',
      });

      setError(''); // Clear any previous error
      alert('Payment added successfully');
    }
  } catch (error) {
    console.error('Error submitting payment data:', error);
    setError('Error submitting payment data. Please try again later.');
  }
};

  

  return (
    <div className="payment-installment-form">
      <h2>Payment Installments</h2>
      <div className="mobile-number-input">
        <label>
          Mobile Number:
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </label>
        <button onClick={() => fetchDataByMobileNumber(mobileNumber)}>Fetch Data</button>
      </div>
      <form onSubmit={handleAddPayment}>
        <fieldset>
          <legend>Project Details</legend>
          <p>Project Name: {formData.projectName}</p>
          <p>Customer ID: {formData.id} </p>
          <p>Customer Name: {`${formData.name.firstName} ${formData.name.lastName}`}</p>
          <p>Square Feet: {formData.squareFeet}</p>
          <p>Total Amount: {formData.totalAmount}</p>
        </fieldset>

        <fieldset>
          <legend>New Payment</legend>
          <div className="payment-inputs">
            <label>
              Paid Amount:
              <input
                type="text"
                value={newPayment.paymentAmount}
                onChange={handlePaidAmountChange} // Call the function to update the paid amount
                required
              />
            </label>
            <label>
              Payment Type:
              <select
                value={newPayment.paymentType}
                onChange={(e) => setNewPayment({ ...newPayment, paymentType: e.target.value })}
                required
              >
                <option value="">Select Payment Type</option>
                <option value="D.D ">D.D No</option>
                <option value="Cheque ">Cheque No</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </label>
            <label>
              Payment Date:
              <input
                type="date"
                value={newPayment.paymentDate}
                onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                required
              />
            </label>
            <label>
              Bank Name:
              <input
                type="text"
                value={newPayment.bankName}
                onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
                required
              />
            </label>
            <label>
              Branch Name:
              <input
                type="text"
                value={newPayment.branchName}
                onChange={(e) => setNewPayment({ ...newPayment, branchName: e.target.value })}
                required
              />
            </label>
            <label>
              Transaction ID:
              <input
                type="text"
                value={newPayment.transactionId}
                onChange={(e) => setNewPayment({ ...newPayment, transactionId: e.target.value })}
                required
              />
            </label>
            <label>
              Commission:
              <select
                value={newPayment.commission}
                onChange={(e) => setNewPayment({ ...newPayment, commission: e.target.value })}
                required
              >
                <option value="">Select Commission Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </div>
          <div className="payment-calculations">
            <label>
              Payment Percentage:
              <input
                type="text"
                value={newPayment.paymentPercentage}
                readOnly // Read-only field
                className="readonly-input"
              />
            </label>
            <label>
              Pending Amount:
              <input
                type="text"
                value={newPayment.pendingAmount}
                readOnly // Read-only field
                className="readonly-input"
              />
            </label>
            <button type="submit">Add Payment</button>
          </div>
        </fieldset>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PaymentInstallmentForm;
