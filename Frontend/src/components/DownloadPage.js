import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import '../styles/DownloadPage.css';

const DownloadPage = () => {
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const navigate = useNavigate();
  const [seniorityNumber, setSeniorityNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [selectedExecutive, setSelectedExecutive] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

 const handleViewPayments = (id) => {
  navigate(`/payment-details/${id}`);
 };

  const fetchData = async () => {
    try {
      const url = 'http://diamondcrown.org:/api/forms/all';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const formattedData = result.map(item => {
        const { _id, __v, date, dateofbirth, address,name, ...rest } = item;
        return {
          ...rest,
          name: formatName(name),
          date: formatDate(date),
          dateofbirth: formatDate(dateofbirth),
          address: formatAddress(address), 
         // Correctly format the address object to a string
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

  const formatName = (name) =>{
    if(!name || typeof name !== 'object') return '';
    const {firstName,lastName} = name;
    return `${firstName || ''} ${lastName || ''}`;
  };

  const formatAddress = (address) => {
    if (!address || typeof address !== 'object') return ''; // Handle invalid address
    const { flatNumber, streetName, area, city, district, state, postalCode, country } = address;
    return `${flatNumber || ''}, ${streetName || ''}, ${area || ''}, ${city || ''}, ${district || ''}, ${state || ''}, ${postalCode || ''}, ${country || ''}`;
  };

  const handleFetchBySeniority = async () => {
    if (seniorityNumber) {
      try {
        const response = await fetch(`http://diamondcrown.org:/api/forms/seniority/${seniorityNumber}`);
  
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
        }
  
        const result = await response.json(); // Expecting a JSON response
        if (result.length > 0) {
          setData(result.map(item => ({
            ...item,
            address: formatAddress(item.address), // Format address before setting data
            name: formatName(item.name),
          })));
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
    setData(fullData); // Reset the data to show all entries
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
    const downloadData = data.map(item => {
      const { _id, __v, aadharFile, pancardFile, affidavitFile, photoFile, ...rest } = item;
      return {
        projectName: item.projectName,
        id: item.id,
        date: item.date,
        name : item.name,
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
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(downloadData);

    const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;

      let headerValue = worksheet[cellAddress].v;

      headerValue = headerValue.replace(/\b\w/g, char => char.toUpperCase());

      if (headerValue.toLowerCase() === "tid") {
        headerValue = "Tid/C.No/D.D";
      }

      worksheet[cellAddress].v = headerValue;

      worksheet[cellAddress].s = {
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
        fill: { fgColor: { rgb: "FFFFAA00" } },
      };
    }

    worksheet['!cols'] = [
      { wpx: 120 },
      { wpx: 60 },
      { wpx: 100 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 150 },
      { wpx: 180 },
      { wpx: 100 },
      { wpx: 180 },
      { wpx: 200 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 100 },
      { wpx: 120 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, 'MyExcelFile.xlsx');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="download-page">
      <h2>Download Data</h2>
      <div className="filter-section" >
      <div className="view-button"> 
        <button onClick={handleViewAll}>View All</button>
      </div>

      <div className="manager-filter">
        <select
          value={selectedManager}
          onChange={(e) => setSelectedManager(e.target.value)}
        >
          <option value="">Select Manager</option>
          <option value="Puneeth">Puneeth</option>
          <option value="Ravi">Ravi</option>
          <option value="Jagadisha KJ"> Jagadhisha KJ </option>
          <option value="Suraj">Suraj</option>
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
          <option value="Lavanya">Lavanya</option>
          <option value="Ramesh">Ramesh</option>
          <option value="Priyadharshini">Priyadharshini</option>
          <option value="Asha">Asha</option>
          <option value="JayaPrakash">JayaPrakash</option>
          <option value="Syed Sahil">Syed Suhil</option>
          <option value="Madhu Raj">Madhu Raj</option>
          <option value="Arjun Vasudev">Arjun Vasudev</option>
          <option value="Fazil">Fazil</option>
          <option value="Raghu Gowda">Raghu Gowda</option>
          <option value="Suhail Pasha">Suhail Pasha</option>
          <option value="Mukul Rajkumar">Mukul Rajkumar</option>
          <option value="Mamtha Parida">Mamtha Parida</option>
        </select>
        <button onClick={handleFetchByExecutive}>Fetch by Executive</button>
      </div>
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
            <th>Name</th>
            <th>Mobile Number</th>
            <th>Alternative Mobile Number</th>
            <th>Date of Birth</th>
            <th>Email ID</th>
            <th  style={{ width: '250px' }}>Address</th> 
            <th>Manager Name</th>
            <th>Executive Name</th>
            <th>Seniority Number</th>
            <th>Square Feet</th>
            <th>Total Amount</th>
            <th>Aadhar</th>
            <th>Pancard</th>
            <th>Affidavit</th>
            <th>Photo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr id={`row-${item.id}`} key={item.id}>
              <td>{highlightSearchTerm(item.projectName)}</td>
              <td>{highlightSearchTerm(item.id)}</td>
              <td>{highlightSearchTerm(item.date)}</td>
              <td>{highlightSearchTerm(item.name)}</td>
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
              <td>
  {item.aadharFile ? (
    <a href={`http://diamondcrown.org/api/documentation/file/${item.aadharFile}`} target="_blank" rel="noopener noreferrer">
      View Aadhar
    </a>
  ) : (
    <>&nbsp;</>
  )}
</td>
<td>
  {item.pancardFile ? (
    <a href={`http://diamondcrown.org/api/documentation/file/${item.pancardFile}`} target="_blank" rel="noopener noreferrer">
      View Pancard
    </a>
  ) : (
    <>&nbsp;</>
  )}
</td>
<td>
  {item.affidavitFile ? (
    <a href={`http://diamondcrown.org/api/documentation/file/${item.affidavitFile}`} target="_blank" rel="noopener noreferrer">
      View Affidavit
    </a>
  ) : (
    <>&nbsp;</>
  )}
</td>
<td>
  {item.photoFile ? (
    <a href={`http://diamondcrown.org/api/documentation/file/${item.photoFile}`} target="_blank" rel="noopener noreferrer">
      View Photo
    </a>
  ) : (
    <>&nbsp;</>
  )}
</td>
<td>
  <button onClick={ () => handleViewPayments(item.id)}>View Payments</button>
</td>

  </tr>
      ))}
      </tbody>
      </table>
      <br/>
    </div>
  );
};

export default DownloadPage;
