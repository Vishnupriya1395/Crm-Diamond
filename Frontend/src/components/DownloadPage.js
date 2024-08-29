import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import '../styles/DownloadPage.css';

const DownloadPage = () => {
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [seniorityNumber, setSeniorityNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();

      const formattedData = result.map(item => {
        const { _id, __v, date, dateofbirth, ...rest } = item;
        return {
          ...rest,
          date: formatDate(date),
          dateofbirth: formatDate(dateofbirth),
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

  const handleFetchBySeniority = async () => {
    if (seniorityNumber) {
      try {
        const response = await fetch(`http://localhost:5000/api/forms/seniority/${seniorityNumber}`);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        if (result.length > 0) {
          setData(result);
        } else {
          alert('No data found for the entered Seniority Number');
        }
      } catch (error) {
        console.error('Error fetching by seniority:', error);
        alert(`Error fetching data: ${error.message}`);
      }
    } else {
      alert("Please enter a seniority number.");
    }
  };

  const handleFetchByManager = () => {
    if (selectedManager) {
      const filteredData = fullData.filter(item => item.managerName === selectedManager);
      setData(filteredData);
    } else {
      alert("Please select a manager.");
    }
  };

  const handleFetchByExecutive = () => {
    if (selectedExecutive) {
      const filteredData = fullData.filter(item => item.executiveName === selectedExecutive);
      setData(filteredData);
    } else {
      alert("Please select an executive.");
    }
  };

  const handleViewAll = () => {
    setData(fullData);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setMatches([]);

    try {
      if (term) {
        setData(fullData);
        const sanitizedTerm = term.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const newMatches = fullData
          .map((item, index) => {
            const match = Object.values(item).some((value) =>
              value.toString().toLowerCase().includes(sanitizedTerm.toLowerCase())
            );
            return match ? index : -1;
          })
          .filter((index) => index !== -1);
        setMatches(newMatches);
        setCurrentMatchIndex(0);
        if (newMatches.length > 0) {
          scrollToMatch(newMatches[0]);
        }
      }
    } catch (error) {
      alert("Invalid input");
    }
  };

  const scrollToMatch = (index) => {
    const element = document.getElementById(`row-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextMatch = () => {
    if (matches.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);
    scrollToMatch(matches[nextIndex]);
  };

  const handlePrevMatch = () => {
    if (matches.length === 0) return;
    const prevIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(prevIndex);
    scrollToMatch(matches[prevIndex]);
  };

  const highlightSearchTerm = (text) => {
    if (text === undefined || text === null) return ''; // Handle undefined or null values
    if (!searchTerm) return text;
    const sanitizedTerm = searchTerm.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${sanitizedTerm})`, 'gi');
    const parts = text.toString().split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };
  

  const handleFetchMatches = () => {
    if (searchTerm) {
      setData(fullData);
      const filteredData = fullData.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setData(filteredData);
      setMatches(matches);
    }
  };

  const handleDownload = () => {
    // Filter out the fields you don't want to include in the Excel file
    const downloadData = data.map(item => {
      const { _id, __v, aadharFile, pancardFile, affidavitFile, photoFile, ...rest } = item;
      return {
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
        // Exclude the aadharFile, pancardFile, affidavitFile, and photoFile fields
      };
    });
  
    const worksheet = XLSX.utils.json_to_sheet(downloadData);


  // Apply styles to the header row
  const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C }); // Header is in row 0
    if (!worksheet[cellAddress]) continue;
  
    // Get the current header value
    let headerValue = worksheet[cellAddress].v;
    
    // Capitalize the first letter of each word in the header
    headerValue = headerValue.replace(/\b\w/g, char => char.toUpperCase());
    
    if(headerValue.toLowerCase() === "tid" )
      {
        headerValue="Tid/C.No/D.D";
      }   // Update the header value with the capitalized version
    worksheet[cellAddress].v = headerValue;
  
    // Apply the bold style and any other styling (alignment, background color, etc.)
    worksheet[cellAddress].s = {
      font: { bold: true }, // Make header bold
      alignment: { horizontal: 'center', vertical: 'center' }, // Center alignment
      fill: { fgColor: { rgb: "FFFFAA00" } }, // Optional: Background color
    };
  }

  // Adjust column widths
  worksheet['!cols'] = [
    { wpx: 120 }, // Project Name
    { wpx: 60 },  // ID
    { wpx: 100 }, // Date
    { wpx: 120 }, // First Name
    { wpx: 120 }, // Last Name
    { wpx: 150 }, // Mobile Number
    { wpx: 180 }, // Alternative Mobile Number
    { wpx: 100 }, // Date of Birth
    { wpx: 180 }, // Email ID
    { wpx: 200 }, // Address
    { wpx: 100 }, // Manager Name
    { wpx: 100 }, // Executive Name
    { wpx: 100 }, // Seniority Number
    { wpx: 100 }, // Square Feet
    { wpx: 120 }, // Total Amount
    { wpx: 120 }, // Payment Type
    { wpx: 120 }, // Paid Amount
    { wpx: 120 }, // Pending Amount
    { wpx: 150 }, // Tid / C.no / DD
    { wpx: 150 }, // Bank Name
    { wpx: 150 }, // Branch
    { wpx: 100 }, // Payment %
    { wpx: 120 }, // Commission
  ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'MyExcelFile.xlsx');
  };
  

  useEffect(() => {
    fetchData('http://localhost:5000/api/forms/all');
  }, []);

  return (
    <div className="download-page">
      <h2>Download Data</h2>

      <div className="view-button"> 
        <button onClick={handleViewAll}>View All</button>
      </div>

      <div className="fetch-button">
        <input
          type="text"
          placeholder="Seniority No"
          value={seniorityNumber}
          onChange={(e) => setSeniorityNumber(e.target.value)}
        />
        <button onClick={handleFetchBySeniority}>Fetch</button>
      </div>

      <div className="manager-filter">
        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          <option value="">Select Manager</option>
          <option value="Puneeth">Puneeth</option>
          <option value="Ravi">Ravi</option>
        </select>
        <button onClick={handleFetchByManager}>Fetch by Manager</button>
      </div>

      <div className="executive-filter">
        <select
          value={selectedExecutive}
          onChange={(e) => setSelectedExecutive(e.target.value)}
        >
          <option value="">Select Executive</option>
          <option value="Shravani">Shravani</option>
          <option value="Monty">Monty</option>
          <option value="Anup R">Anup R</option>
          <option value="Priyanka">Priyanka</option>
          <option value="Anitha">Anitha</option>
          <option value="Jagadhish">Jagadhish</option>
          <option value="Madhu">Madhu</option>
          <option value="Nithin">Nithin</option>
          <option value="Shrinidhi">Shrinidhi</option>
          <option value="Shyla">Shyla</option>
          <option value="Raghu">Raghu</option>
          <option value="Bhavya">Bhavya</option>
          <option value="Mukul">Mukul</option>
        </select>
        <button onClick={handleFetchByExecutive}>Fetch by Executive</button>
      </div>
      <section className="download-button">
        <button onClick={handleDownload}>Download Excel</button>
      </section>
      <div className="search-box">
        <input
          type="text" placeholder="Search Here"  value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {matches.length > 0 && (
          <div>
            <button onClick={handlePrevMatch}>&lt;</button>
            <button onClick={handleNextMatch}>&gt;</button>
            <button onClick={handleFetchMatches}>Fetch Matches</button>
            <p>
              {currentMatchIndex + 1} of {matches.length} matches
            </p>
          </div>
        )}
      </div>

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
            <th>Payment Type</th>
            <th>Paid Amount</th>
            <th>Pending Amount</th>
            <th>Tid / C.no / DD</th>
            <th>Bank Name</th>
            <th>Branch</th>
            <th>Payment %</th>
            <th>Commission</th>
            <th>Aadhar</th>
            <th>Pancard</th>
            <th>Affidavit</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr id={`row-${index}`} key={index}>
              <td>{highlightSearchTerm(item.projectName)}</td>
              <td>{highlightSearchTerm(item.id)}</td>
              <td>{highlightSearchTerm(item.date)}</td>
              <td>{highlightSearchTerm(item.firstName)}</td>
              <td>{highlightSearchTerm(item.lastName)}</td>
              <td>{highlightSearchTerm(item.mobileNumber)}</td>
              <td>{highlightSearchTerm(item.alternativeMobileNumber)}</td>
              <td>{highlightSearchTerm(item.dateofbirth)}</td>
              <td>{highlightSearchTerm(item.emailid)}</td>
              <td>{highlightSearchTerm(item.address)}</td>
              <td>{highlightSearchTerm(item.managerName)}</td>
              <td>{highlightSearchTerm(item.executiveName)}</td>
              <td>{highlightSearchTerm(item.seniorityNumber)}</td>
              <td>{highlightSearchTerm(item.squareFeet)}</td>
              <td>{highlightSearchTerm(item.totalAmount)}</td>
              <td>{highlightSearchTerm(item.paymentType)}</td>
              <td>{highlightSearchTerm(item.paidAmount)}</td>
              <td>{highlightSearchTerm(item.pendingAmount)}</td>
              <td>{highlightSearchTerm(item.tid)}</td>
              <td>{highlightSearchTerm(item.bankName)}</td>
              <td>{highlightSearchTerm(item.branch)}</td>
              <td>{highlightSearchTerm(item.paymentPercentage)}</td>
              <td>{highlightSearchTerm(item.commission)}</td>
              <td>
                {item.aadharFile ? (
                  <a href={`http://localhost:5000/${item.aadharFile}`} target="_blank" rel="noopener noreferrer">
                    View Aadhar
                  </a>
                ) : (
                  <>&nbsp;</> // Render empty space if no file
                )}
              </td>
              <td>
                {item.pancardFile ? (
                  <a href={`http://localhost:5000/${item.pancardFile}`} target="_blank" rel="noopener noreferrer">
                    View Pancard
                  </a>
                ) : (
                  <>&nbsp;</> // Render empty space if no file
                )}
              </td>
              <td>
                {item.affidavitFile ? (
                  <a href={`http://localhost:5000/${item.affidavitFile}`} target="_blank" rel="noopener noreferrer">
                    View Affidavit
                  </a>
                ) : (
                  <>&nbsp;</> // Render empty space if no file
                )}
              </td>
              <td>
                {item.photoFile ? (
                  <a href={`http://localhost:5000/${item.photoFile}`} target="_blank" rel="noopener noreferrer">
                    View Photo
                  </a>
                ) : (
                  <>&nbsp;</> // Render empty space if no file
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
   
    </div>
  );
};

export default DownloadPage;
