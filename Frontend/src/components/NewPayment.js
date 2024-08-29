import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/NewPayment.css'; // Import the CSS file

const NewPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = location.state || {};

  const [newPayment, setNewPayment] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [commission, setCommission] = useState('Pending');
  const [pendingAmount, setPendingAmount] = useState('');
  const [paymentPercentage, setPaymentPercentage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  useEffect(() => {
    if (formData) {
      const totalAmt = parseFloat(formData.totalAmount.replace(/,/g, '')) || 0;
      const paidAmt = formData.paidAmounts.reduce((sum, amt) => sum + parseFloat(amt.replace(/,/g, '')), 0);
      setPendingAmount(totalAmt - paidAmt);
    }
  }, [formData]);

  const handleNewPaymentChange = (e) => {
    const payment = parseFloat(e.target.value.replace(/,/g, '')) || 0;
    setNewPayment(payment);

    if (formData) {
      const totalAmt = parseFloat(formData.totalAmount.replace(/,/g, '')) || 0;
      const paidAmt = formData.paidAmounts.reduce((sum, amt) => sum + parseFloat(amt.replace(/,/g, '')), 0);

      const newPendingAmount = totalAmt - (paidAmt + payment);
      const newPaymentPercentage = ((paidAmt + payment) / totalAmt) * 100;

      setPendingAmount(newPendingAmount.toLocaleString());
      setPaymentPercentage(newPaymentPercentage.toFixed(2) + '%');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Form submission started...');
  
    try {
      const existingDocument = await fetch(`http://localhost:5000/api/forms/member/${formData.id}`)
        .then(res => res.json());
  
      console.log('Existing document fetched:', existingDocument);
  
      const newPaymentType = formData.paymentType || ''; // Use empty string if undefined
      const newPaidAmount = formData.payAmount || '';
      const newPendingAmount = pendingAmount || '';
      const newPaymentDate = paymentDate || '';
      const newTid = formData.tid || '';
      const newBankName = formData.bankName || '';
      const newBranch = formData.branch || '';
      const newCommission = formData.commission || '';
      const newPaymentPercentage = paymentPercentage || '';
  
      const updatedFormData = {
        ...existingDocument,
        paymentTypes: [...(existingDocument.paymentTypes || []), newPaymentType],
        paidAmounts: [...(existingDocument.paidAmounts || []), newPaidAmount],
        pendingAmounts: [...(existingDocument.pendingAmounts || []), newPendingAmount],
        paymentDates: [...(existingDocument.paymentDates || []), newPaymentDate],
        tids: [...(existingDocument.tids || []), newTid],
        bankNames: [...(existingDocument.bankNames || []), newBankName],
        branches: [...(existingDocument.branches || []), newBranch],
        commissions: [...(existingDocument.commissions || []), newCommission],
        paymentPercentages: [...(existingDocument.paymentPercentages || []), newPaymentPercentage],
      };
  
      console.log('Updated form data:', updatedFormData);
  
      const response = await fetch(`http://localhost:5000/api/forms/update/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update the payment data.');
      }
  
      const data = await response.json();
      console.log('Payment added successfully:', data);
  
      // Handle success
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };
  

  if (!formData) {
    return <p>No form data found. Please go back and try again.</p>;
  }

  return (
    <div className="new-payment">
      <h2>New Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Date:
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </label>
        <label>
          Square Feet:
          <input
            type="text"
            value={formData.squareFeet || ''}
            readOnly
          />
        </label>
        <label>
          Total Amount:
          <input
            type="text"
            value={formData.totalAmount || ''}
            readOnly
          />
        </label>
        <label>
          Paid Amount:
          <input
            type="text"
            value={formData.paidAmounts.reduce((sum, amt) => sum + parseFloat(amt.replace(/,/g, '')), 0).toLocaleString()}
            readOnly
          />
        </label>
        <label>
          New Payment:
          <input
            type="text"
            value={newPayment}
            onChange={handleNewPaymentChange}
            required
          />
        </label>
        <label>
          Pending Amount:
          <input
            type="text"
            value={pendingAmount}
            readOnly
          />
        </label>
        <label>
          Payment Percentage:
          <input
            type="text"
            value={paymentPercentage}
            readOnly
          />
        </label>
        <label>
          Commission:
          <select
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <button type="submit">Add Payment</button>
      </form>

      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default NewPayment;
