import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../styles/PaymentDetails.css';

const PaymentDetails = () => {
  const { id } = useParams(); // Fetch customer ID from the route
  const [customerData, setCustomerData] = useState(null);
  const [payments, setPayments] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`http://diamondcrown.org/api/payments/forms/${id}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
        const result = await response.json(); // Expecting JSON response
        setCustomerData(result);
        setPayments(result.payments);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };
  
    fetchCustomerData();
  }, [id]);
  

  const handleDownload = () => {
    const downloadData = payments.map(payment => ({
      PaymentAmount: payment.paymentAmount,
      PaymentType: payment.paymentType,
      PaymentDate: payment.paymentDate,
      BankName: payment.bankName,
      BranchName: payment.branchName,
      TransactionID: payment.transactionId,
      PaymentPercentage: payment.paymentPercentage + '%',
      PendingAmount: payment.pendingAmount,
      Commission: payment.commission,
    }));

    const worksheet = XLSX.utils.json_to_sheet(downloadData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
    XLSX.writeFile(workbook, 'PaymentDetails.xlsx');
  };

  return (
    <div className="payment-details-page">
      <h2>Payment Details</h2>

      {customerData ? (
        <div className="customer-info">
          <p><strong>Project Name:</strong> {customerData.projectName}</p>
          <p><strong>ID:</strong> {customerData.id}</p>
          <p><strong>Name:</strong> {customerData.name.firstName} {customerData.name.lastName}</p>
          <p><strong>Square Feet:</strong> {customerData.squareFeet}</p>
          <p><strong>Total Amount:</strong> {customerData.totalAmount}</p>
          <p><strong>Seniority Number:</strong> {customerData.seniorityNumber}</p>
        </div>
      ) : (
        <p>No customer details available.</p>
      )}

    {payments.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Payment Amount</th>
            <th>Payment Type</th>
            <th>Payment Date</th>
            <th>Bank Name</th>
            <th>Branch Name</th>
            <th>Transaction ID</th>
            <th>Payment Percentage</th>
            <th>Pending Amount</th>
            <th>Commission</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index}>
              <td>{payment.paymentAmount}</td>
              <td>{payment.paymentType}</td>
              <td>{formatDate(payment.paymentDate)}</td>
              <td>{payment.bankName}</td>
              <td>{payment.branchName}</td>
              <td>{payment.transactionId}</td>
              <td>{payment.paymentPercentage}%</td>
              <td>{payment.pendingAmount}</td>
              <td>{payment.commission} </td>
            </tr>
          ))}
        </tbody>
      </table>
) : (
  <p>No payment details available</p>
)}
      <button onClick={handleDownload}>Download Payments</button>
    </div>
  );
};

export default PaymentDetails;
