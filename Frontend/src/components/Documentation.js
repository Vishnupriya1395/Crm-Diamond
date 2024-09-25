import React, { useState } from 'react';
import '../styles/Documentation.css';

const Documentation = () => {
  const [mobileNumber, setmobileNumber] = useState('');
  const [memberData, setMemberData] = useState(null); // Combined state to hold fetched data
  const [aadharFile, setAadharFile] = useState(null);
  const [pancardFile, setPancardFile] = useState(null);
  const [affidavitFile, setAffidavitFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchMemberData = async () => {
    if (!mobileNumber) {
      setErrorMessage('Please enter a phone number.');
      return;
    }

    try {
      const response = await fetch(`http://diamondcrown.org/api/documentation/member/${mobileNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Member Data:", data);  // Confirming the data is fetched

      if (data) {
        setMemberData(data); // Set the fetched data
        setErrorMessage('');
       
        
      } else {
        setErrorMessage('No data found for the entered phone number.');
        alert('"No data found on the entered phone number"');
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      alert('"No data found on the entered phone number"');
      setMemberData(null); // Clear member data if error occurs
    }
  };

  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setFile(file);
      setErrorMessage('');
    } else {
      setErrorMessage('File size must be 10MB or less.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberData) {
      setErrorMessage('Please fetch the member data first.');
      return;
    }

    const formData = new FormData();
    if (aadharFile) formData.append('aadharFile', aadharFile);
    if (pancardFile) formData.append('pancardFile', pancardFile);
    if (affidavitFile) formData.append('affidavitFile', affidavitFile);
    if (photoFile) formData.append('photoFile', photoFile);

for(let [key,value] of formData.entries())
{
  console.log(`${key}: ${value.name}`);
}

    try {
      const response = await fetch(`http://diamondcrown.org:/api/documentation/upload/${mobileNumber}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('Documents uploaded successfully.');
      
        setErrorMessage('');
        // Reset form after successful submission
        setAadharFile(null);
        setPancardFile(null);
        setAffidavitFile(null);
        setPhotoFile(null);
        setmobileNumber('');
        setMemberData(null);
      } else {
        setErrorMessage('An error occurred while uploading the documents.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setErrorMessage('An error occurred while submitting the form.');
    }
  };

  return (
    <div className="documentation">
      <h2>Documentation Upload</h2>

      <div className="fetch-section">
        <input
          type="text"
          placeholder="Enter Phone Number"
          value={mobileNumber}
          onChange={(e) => setmobileNumber(e.target.value)}
        />
        <button onClick={fetchMemberData}>Fetch</button>
      </div>

      {/* Rendering Member Data */}
      {memberData && (
        <div className="member-info">
          <p><strong> Name:</strong>  {memberData.name.firstName} {memberData.name.lastName}</p>
          <p><strong>Seniority Number:</strong> {memberData.seniorityNumber}</p>
        </div>
      )}

      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="file-input">
          <label>Aadhar PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, setAadharFile)}
          />
        </div>

        <div className="file-input">
          <label>Pancard PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, setPancardFile)}
          />
        </div>

        <div className="file-input">
          <label>Affidavit PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, setAffidavitFile)}
          />
        </div>

        <div className="file-input">
          <label>Passport Size Photo (JPEG/PNG):</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={(e) => handleFileChange(e, setPhotoFile)}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Documentation;
