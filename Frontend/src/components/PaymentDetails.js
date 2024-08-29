import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/Paymentdetails.css'; // Import the CSS file

const PaymentDetails = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const mobileNumber = new URLSearchParams(location.search).get('mobileNumber');
  const [formData, setFormData] = useState({
    paymentType: '',
    totalAmount: '',
    enterAmount: '',
    paidAmount: '',
    pendingAmount: '',
    tid: '',
    bankName: '',
    branch: '',
    paymentPercentage: '',
    commission: '',
  });
  const [initialPaidAmount, setInitialPaidAmount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/forms/member/${mobileNumber}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormData((prevFormData) => ({
          ...prevFormData,
          totalAmount: data.totalAmount,
          paidAmount: data.paidAmount,
        }));
        setInitialPaidAmount(parseFloat(data.paidAmount) || 0);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setError('Error fetching payment data. Please try again later.');
      }
    };

    fetchPaymentData();
  }, [mobileNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value,
      };

      if (name === 'enterAmount') {
        const total = parseFloat(prevFormData.totalAmount.replace(/,/g, '')) || 0;
        const enter = parseFloat(value.replace(/,/g, '')) || 0;
        const newPaidAmount = initialPaidAmount + enter;
        const newPendingAmount = total - newPaidAmount;
        const newPaymentPercentage = ((newPaidAmount / total) * 100).toFixed(2);

        updatedFormData.paidAmount = newPaidAmount.toFixed(2);
        updatedFormData.pendingAmount = newPendingAmount >= 0 ? newPendingAmount.toFixed(2) : '0.00';
        updatedFormData.paymentPercentage = newPendingAmount >= 0 ? `${newPaymentPercentage}%` : '0.00%';
      }

      return updatedFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/forms/payment/submit/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Payment submitted:', data);

      // Clear the form data
      setFormData({
        paymentType: '',
        totalAmount: '',
        enterAmount: '',
        paidAmount: '',
        pendingAmount: '',
        tid: '',
        bankName: '',
        branch: '',
        paymentPercentage: '',
        commission: '',
      });
    } catch (error) {
      console.error('Error submitting payment:', error);
      setError('Error submitting payment. Please try again later.');
    }
  };

  return (
    <div className="payment-details">
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Payment Details</legend>
          <label>
            Payment type:
            <select name="paymentType" value={formData.paymentType} onChange={handleChange} required>
              <option value="">Select Payment Type</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="netbanking">Net Banking</option>
              <option value="dd">D.D</option>
              <option value="nach/ecs">NACH/ECS</option>
            </select>
          </label>
          <label>
            Total Amount:
            <input type="text" name="totalAmount" value={formData.totalAmount} readOnly />
          </label>
          <label>
            Enter Amount:
            <input type="text" name="enterAmount" value={formData.enterAmount} onChange={handleChange} required />
          </label>
          <label>
            Paid Amount:
            <input type="text" name="paidAmount" value={formData.paidAmount} readOnly />
          </label>
          <label>
            Pending Amount:
            <input type="text" name="pendingAmount" value={formData.pendingAmount} readOnly />
          </label>
          <label>
            TID/C.No/DD:
            <input type="text" name="tid" value={formData.tid} onChange={handleChange} required />
          </label>
        </fieldset>
        <fieldset>
          <legend>Bank Details</legend>
          <label>
            Bank Name:
            <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} required />
          </label>
          <label>
            Branch:
            <input type="text" name="branch" value={formData.branch} onChange={handleChange} required />
          </label>
        </fieldset>
        <label>
          Payment %:
          <input type="text" name="paymentPercentage" value={formData.paymentPercentage} readOnly />
        </label>
        <label>
          Commission:
          <select name="commission" value={formData.commission} onChange={handleChange} required>
            <option value="">Select Commission Status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </label>
        <div className="submit-button">
          <button type="submit">Submit Payment</button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default PaymentDetails;
