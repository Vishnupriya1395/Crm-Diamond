import React, { useState, useEffect } from 'react';
import '../styles/manager.css';

const Manager = () => {
  const [managerName, setManagerName] = useState('');
  const [executiveName, setExecutiveName] = useState('');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const executivesByManager = {
    Puneeth: ['Nithin', 'Shrinidhi', 'Shyla', 'Raghu', 'Bhavya', 'Mukul'],
    Ravi: ['Shravani', 'Monty', 'Anup R', 'Priyanka', 'Anitha', 'Jagadhish', 'Madhu']
  };

  useEffect(() => {
    if (managerName && executiveName) {
      fetch(`http://localhost:5000/api/forms?manager=${managerName}&executive=${executiveName}`)
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [managerName, executiveName]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.toString().split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? <mark key={index}>{part}</mark> : part
    );
  };

  const handleDownload = () => {
    const csvData = data.map(item => ({
      projectName: item.projectName,
      id: item.id,
      date: item.date,
      firstName: item.firstName,
      lastName: item.lastName,
      mobileNumber: item.mobileNumber,
      alternativeMobileNumber: item.alternativeMobileNumber,
      dateofbirth: item.dateofbirth,
      emailid: item.emailid,
      address: item.address,
      managerName: item.managerName,
      executiveName: item.executiveName,
      seniorityNumber: item.seniorityNumber,
      squareFeet: item.squareFeet,
      totalAmount: item.totalAmount,
      paymentType: item.paymentType,
      paidAmount: item.paidAmount,
      pendingAmount: item.pendingAmount,
      tid: item.tid,
      bankName: item.bankName,
      branch: item.branch,
      paymentPercentage: item.paymentPercentage,
      commission: item.commission,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="manager">
      <h2>Documentation</h2>
      <label>
        Manager Name:
        <select name="managerName" value={managerName} onChange={(e) => setManagerName(e.target.value)} required>
          <option value="">Select Manager</option>
          {Object.keys(executivesByManager).map((manager) => (
            <option key={manager} value={manager}>
              {manager}
            </option>
          ))}
        </select>
      </label>
      <label>
        Executive Name:
        <select name="executiveName" value={executiveName} onChange={(e) => setExecutiveName(e.target.value)} required>
          <option value="">Select Executive</option>
          {managerName && executivesByManager[managerName].map((executive) => (
            <option key={executive} value={executive}>
              {executive}
            </option>
          ))}
        </select>
      </label>
      {data.length > 0 && (
        <>
          <label>
            Search:
            <input type="text" value={searchQuery} onChange={handleSearchChange} />
          </label>
          <button onClick={handleDownload}>Download CSV</button>
          <table>
            <thead>
              <tr>
                <th>ProjectName</th>
                <th>ID</th>
                <th>Date</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile Number</th>
                <th>Alternative Mobile Number</th>
                <th>Date of Birth</th>
                <th>Email ID</th>
                <th>Address</th>
                <th>Manager Name</th>
                <th>Executive Name</th>
                <th>Seniority Number</th>
                <th>Square Feet</th>
                <th>Total Amount</th>
                <th>PaymentType</th>
                <th>Paid Amount</th>
                <th>Pending Amount</th>
                <th>Tid / C.no / DD</th>
                <th>Bank Name</th>
                <th>Branch</th>
                <th>Payment %</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>{highlightText(item.projectName, searchQuery)}</td>
                  <td>{highlightText(item.id, searchQuery)}</td>
                  <td>{highlightText(item.date, searchQuery)}</td>
                  <td>{highlightText(item.firstName, searchQuery)}</td>
                  <td>{highlightText(item.lastName, searchQuery)}</td>
                  <td>{highlightText(item.mobileNumber, searchQuery)}</td>
                  <td>{highlightText(item.alternativeMobileNumber, searchQuery)}</td>
                  <td>{highlightText(item.dateofbirth, searchQuery)}</td>
                  <td>{highlightText(item.emailid, searchQuery)}</td>
                  <td>{highlightText(item.address, searchQuery)}</td>
                  <td>{highlightText(item.managerName, searchQuery)}</td>
                  <td>{highlightText(item.executiveName, searchQuery)}</td>
                  <td>{highlightText(item.seniorityNumber, searchQuery)}</td>
                  <td>{highlightText(item.squareFeet, searchQuery)}</td>
                  <td>{highlightText(item.totalAmount, searchQuery)}</td>
                  <td>{highlightText(item.paymentType, searchQuery)}</td>
                  <td>{highlightText(item.paidAmount, searchQuery)}</td>
                  <td>{highlightText(item.pendingAmount, searchQuery)}</td>
                  <td>{highlightText(item.tid, searchQuery)}</td>
                  <td>{highlightText(item.bankName, searchQuery)}</td>
                  <td>{highlightText(item.branch, searchQuery)}</td>
                  <td>{highlightText(item.paymentPercentage, searchQuery)}</td>
                  <td>{highlightText(item.commission, searchQuery)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Manager;
