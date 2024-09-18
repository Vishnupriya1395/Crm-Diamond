import React, { useState } from 'react';

const PaymentInstallmentForm = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    name: {
      firstName: '',
      lastName: '',
    },
    squareFeet: '',
    totalAmount: '',
    payments: [],
    paidAmount: '',
    paymentType: '',
    bankName: '',
    branchName: '',
    transactionId: '',
    commission: '',
    paymentPercentage: '',
    pendingAmount: '',
  });

  const [error, setError] = useState('');

  const fetchDataByMobileNumber = async () => {
    if (!mobileNumber) {
      setError('Please enter a mobile number.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/forms/member/${mobileNumber}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data.');
      }

      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          projectName: data.projectName || '',
          name: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
          },
          squareFeet: data.squareFeet || '',
          totalAmount: data.totalAmount || '',
          payments: data.payments || [],
        }));
      } else {
        setError('No data found for the given mobile number.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data. Please try again later.');
    }
  };

  const handleAddPayment = () => {
    const paidAmountNumber = parseFloat(formData.paidAmount) || 0;
    const totalAmountNumber = parseFloat(formData.totalAmount) || 0;
    const cumulativePaidAmount = formData.payments.reduce(
      (sum, payment) => sum + parseFloat(payment.paidAmount),
      0
    );

    const newPaymentPercentage = ((cumulativePaidAmount + paidAmountNumber) / totalAmountNumber) * 100;
    const newPendingAmount = totalAmountNumber - (cumulativePaidAmount + paidAmountNumber);

    const newPayment = {
      paidAmount: paidAmountNumber,
      paymentType: formData.paymentType,
      bankName: formData.bankName,
      branchName: formData.branchName,
      transactionId: formData.transactionId,
      commission: formData.commission,
      paymentPercentage: newPaymentPercentage.toFixed(2) + '%',
      pendingAmount: newPendingAmount.toFixed(2),
    };

    setFormData((prevData) => ({
      ...prevData,
      payments: [...prevData.payments, newPayment],
      paidAmount: '',
      paymentType: '',
      bankName: '',
      branchName: '',
      transactionId: '',
      commission: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber, payments: formData.payments }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment data.');
      }

      const data = await response.json();
      console.log('Payments submitted successfully:', data);
      setFormData((prevData) => ({
        ...prevData,
        payments: [],
      }));
    } catch (error) {
      console.error('Error submitting payment data:', error);
      setError('Error submitting payment data. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Payment Installments</h2>
      <div>
        <label>
          Mobile Number:
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
          />
        </label>
        <button onClick={fetchDataByMobileNumber}>Fetch Data</button>
      </div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Project Details</legend>
          <p>Project Name: {formData.projectName}</p>
          <p>Customer Name: {`${formData.name.firstName} ${formData.name.lastName}`}</p>
          <p>Square Feet: {formData.squareFeet}</p>
          <p>Total Amount: {formData.totalAmount}</p>
        </fieldset>

        <fieldset>
          <legend>New Payment</legend>
          <label>
            Paid Amount:
            <input
              type="text"
              value={formData.paidAmount}
              onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              required
            />
          </label>
          <label>
            Payment Type:
            <select
              value={formData.paymentType}
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
              required
            >
              <option value="">Select Payment Type</option>
              <option value="D.D No">D.D No</option>
              <option value="Cheque No">Cheque No</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Cash">Cash</option>
            </select>
          </label>
          <label>
            Bank Name:
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              required
            />
          </label>
          <label>
            Branch Name:
            <input
              type="text"
              value={formData.branchName}
              onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
              required
            />
          </label>
          <label>
            Transaction ID:
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              required
            />
          </label>
          <label>
            Commission:
            <select
              value={formData.commission}
              onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
              required
            >
              <option value="">Select Commission Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <p>Payment Percentage: {formData.paymentPercentage}</p>
          <p>Pending Amount: {formData.pendingAmount}</p>
          <button type="button" onClick={handleAddPayment}>
            Add Payment
          </button>
        </fieldset>
        <button type="submit">Submit Payments</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PaymentInstallmentForm;
