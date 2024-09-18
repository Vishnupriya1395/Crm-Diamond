import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const PaymentDetails = ({ clientId }) => {
  const [paymentData, setPaymentData] = useState([]);

  const fetchPaymentDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/${clientId}`);
      if (!response.ok) {
        throw new Error(`Error fetching payment data: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      setPaymentData(result);
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

  const handleDownloadPayments = () => {
    const worksheet = XLSX.utils.json_to_sheet(paymentData.map((item, index) => ({
      "S.No": index + 1,
      "Payment Dates": item.paymentDate,
      "Payment Type": item.paymentType,
      "Paid Amount": item.paidAmount,
      "Tid/C.No/D.D": item.tid,
      "Bank Name": item.bankName,
      "Branch": item.branch
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
    XLSX.writeFile(workbook, 'ClientPayments.xlsx');
  };

  useEffect(() => {
    fetchPaymentDetails();
  }, [clientId]);

  return (
    <div>
      <h3>Payment Details for Client ID: {clientId}</h3>
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Payment Dates</th>
            <th>Payment Type</th>
            <th>Paid Amount</th>
            <th>Tid/C.No/D.D</th>
            <th>Bank Name</th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.paymentDate}</td>
              <td>{item.paymentType}</td>
              <td>{item.paidAmount}</td>
              <td>{item.tid}</td>
              <td>{item.bankName}</td>
              <td>{item.branch}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDownloadPayments}>Download Payments</button>
    </div>
  );
};

export default PaymentDetails;
