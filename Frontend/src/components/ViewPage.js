import React, { useState } from 'react';

const ViewPage = () => {
  const [data, setData] = useState([]);
  const [seniorityNumber, setSeniorityNumber] = useState('');
  const [managerName, setManagerName] = useState('');
  const [executiveName, setExecutiveName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleViewAll = () => {
    fetchData('http://localhost:5000/api/forms/all');
  };

  const handleFetchBySeniority = () => {
    fetchData(`http://localhost:5000/api/forms/seniority/${seniorityNumber}`);
  };

  const handleFetchByManagerAndExecutive = () => {
    fetchData(`http://localhost:5000/api/forms/manager/${managerName}/executive/${executiveName}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val => val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="view-page">
      <h2>View Data</h2>
      <button onClick={handleViewAll}>View All</button>
      <input
        type="text"
        placeholder="Search by Seniority Number"
        value={seniorityNumber}
        onChange={(e) => setSeniorityNumber(e.target.value)}
      />
      <button onClick={handleFetchBySeniority}>Fetch</button>
      <input
        type="text"
        placeholder="Manager Name"
        value={managerName}
        onChange={(e) => setManagerName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Executive Name"
        value={executiveName}
        onChange={(e) => setExecutiveName(e.target.value)}
      />
      <button onClick={handleFetchByManagerAndExecutive}>Fetch</button>
      <input
        type="text"
        placeholder="Search in Table"
        value={searchTerm}
        onChange={handleSearch}
      />
      <table>
        <thead>
          <tr>
            {/* Add table headers */}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {/* Add table data */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewPage;
