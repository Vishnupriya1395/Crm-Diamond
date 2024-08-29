import React, { useState } from 'react';

const AddPayment = ({ customerId, onPaymentAdded }) => {
  const [paymentData, setPaymentData] = useState({
    paymentType: '',
    paidAmount: '',
    tid: '',
    bankName: '',
    branch: '',
    commission: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentData.paidAmount || !paymentData.paymentType || !paymentData.tid || !paymentData.bankName || !paymentData.branch || !paymentData.commission) {
      setError('Please fill in all the fields');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/payments/add/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      console.log('Payment added successfully:', data);

      onPaymentAdded(data);
      setPaymentData({
        paymentType: '',
        paidAmount: '',
        tid: '',
        bankName: '',
        branch: '',
        commission: '',
      });
    } catch (error) {
      console.error('Error adding payment:', error);
      setError('Error adding payment. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Payment Installment</h3>
      <label>
        Payment Type:
        <select name="paymentType" value={paymentData.paymentType} onChange={handleChange} required>
          <option value="">Select Payment</option>
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="netbanking">Net Banking</option>
          <option value="dd">D.D</option>
          <option value="nach\ecs">NACH\ECS</option>
        </select>
      </label>
      <label>
        Paid Amount:
        <input type="text" name="paidAmount" value={paymentData.paidAmount} onChange={handleChange} required />
      </label>
      <label>
        TID:
        <input type="text" name="tid" value={paymentData.tid} onChange={handleChange} required />
      </label>
      <label>
        Bank Name:
        <input type="text" name="bankName" value={paymentData.bankName} onChange={handleChange} required />
      </label>
      <label>
        Branch:
        <input type="text" name="branch" value={paymentData.branch} onChange={handleChange} required />
      </label>
      <label>
        Commission:
        <select name="commission" value={paymentData.commission} onChange={handleChange} required>
          <option value="">Select Commission Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
      <button type="submit">Add Payment</button>

      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default AddPayment;
