import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import '../styles/DownloadPage.css';
import PaymentDetails from './PaymentDetails'; // New component for payment details

const DownloadPage = () => {
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [seniorityNumber, setSeniorityNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null); // To handle the selected client for payment details

  const fetchData = async () => {
    try {
      const url = 'http://localhost:5000/api/forms/all';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const formattedData = result.map(item => {
        const { _id, __v, date, dateofbirth, address, firstName, lastName, ...rest } = item;
        return {
          ...rest,
          clientName: `${firstName} ${lastName}`, // Merge first and last name into Client Name
          date: formatDate(date),
          dateofbirth: formatDate(dateofbirth),
          address: formatAddress(address), // Correctly format the address object to a string
        };
      });

      setData(formattedData);
      setFullData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return ''; // Handle invalid address
    const { flatNumber, streetName, area, city, district, state, postalCode, country } = address;
    return `${flatNumber || ''}, ${streetName || ''}, ${area || ''}, ${city || ''}, ${district || ''}, ${state || ''}, ${postalCode || ''}, ${country || ''}`;
  };

  const handleViewPayments = (clientId) => {
    setSelectedClient(clientId); // Set the selected client for displaying payment details
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="download-page">
      <h2>Download Data</h2>

      {/* Fetch and Filter Buttons, Search Box, etc. remain unchanged */}

      <table>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>ID</th>
            <th>Date</th>
            <th>Client Name</th> {/* New merged Client Name column */}
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
            <th>Payment %</th>
            <th>Commission</th>
            <th>Action</th> {/* New Action column for View Payments */}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr id={`row-${index}`} key={index}>
              <td>{highlightSearchTerm(item.projectName)}</td>
              <td>{highlightSearchTerm(item.id)}</td>
              <td>{highlightSearchTerm(item.date)}</td>
              <td>{highlightSearchTerm(item.clientName)}</td> {/* Render merged Client Name */}
              <td>{highlightSearchTerm(item.mobileNumber)}</td>
              <td>{highlightSearchTerm(item.alternativeMobileNumber)}</td>
              <td>{highlightSearchTerm(item.dateofbirth)}</td>
              <td>{highlightSearchTerm(item.emailid)}</td>
              <td>{highlightSearchTerm(item.address)}</td> {/* Render the formatted address */}
              <td>{highlightSearchTerm(item.managerName)}</td>
              <td>{highlightSearchTerm(item.executiveName)}</td>
              <td>{highlightSearchTerm(item.seniorityNumber)}</td>
              <td>{highlightSearchTerm(item.squareFeet)}</td>
              <td>{highlightSearchTerm(item.totalAmount)}</td>
              <td>{highlightSearchTerm(item.paymentPercentage)}</td>
              <td>{highlightSearchTerm(item.commission)}</td>
              <td>
                <button onClick={() => handleViewPayments(item.id)}>View Payments</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {selectedClient && <PaymentDetails clientId={selectedClient} />} {/* Render PaymentDetails for selected client */}
    </div>
  );
};

export default DownloadPage;
