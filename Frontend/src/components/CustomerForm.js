import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ProjectForm.css';

const CustomerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    date: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    alternativeMobileNumber: '',
    dateofbirth: '',
    emailid: '',
    address: {
      flatNumber: '',
      streetName: '',
      area: '',
      city: '',
      district: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    managerName: '',
    executiveName: '',
    seniorityNumber: '',
    squareFeet: '',
    totalAmount: '',
    paidAmount: '',
    pendingAmount: '',
    commission: '',
    aadharFile: '',
    pancardFile: '',
    photoFile: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/customer/create', {
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
      console.log('Customer created successfully:', data);
      navigate(`/add-payment/${data.customer._id}`); // Redirect to payment page with customer ID
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error submitting form. Please try again later.');
    }
  };

  return (
    <div className="project-form">
      <h2>Customer Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Project Name:
          <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} required />
        </label>
        <label>
          Date:
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </label>
        <label>
          First Name:
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </label>
        <label>
          Last Name:
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </label>
        <label>
          Mobile Number:
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
        </label>
        <label>
          Alternative Mobile Number:
          <input type="text" name="alternativeMobileNumber" value={formData.alternativeMobileNumber} onChange={handleChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} required />
        </label>
        <label>
          Email ID:
          <input type="email" name="emailid" value={formData.emailid} onChange={handleChange} required />
        </label>
        <fieldset>
          <legend>Address</legend>
          <label>
            Flat No/House No:
            <input type="text" name="flatNumber" value={formData.address.flatNumber} onChange={handleChange} required />
          </label>
          <label>
            Street Name:
            <input type="text" name="streetName" value={formData.address.streetName} onChange={handleChange} required />
          </label>
          <label>
            Area:
            <input type="text" name="area" value={formData.address.area} onChange={handleChange} required />
          </label>
          <label>
            City:
            <input type="text" name="city" value={formData.address.city} onChange={handleChange} required />
          </label>
          <label>
            District:
            <input type="text" name="district" value={formData.address.district} onChange={handleChange} required />
          </label>
          <label>
            State:
            <input type="text" name="state" value={formData.address.state} onChange={handleChange} required />
          </label>
          <label>
            Postal Code:
            <input type="text" name="postalCode" value={formData.address.postalCode} onChange={handleChange} required />
          </label>
          <label>
            Country:
            <input type="text" name="country" value={formData.address.country} onChange={handleChange} readOnly />
          </label>
        </fieldset>
        <label>
          Manager Name:
          <input type="text" name="managerName" value={formData.managerName} onChange={handleChange} required />
        </label>
        <label>
          Executive Name:
          <input type="text" name="executiveName" value={formData.executiveName} onChange={handleChange} required />
        </label>
        <label>
          Seniority Number:
          <input type="text" name="seniorityNumber" value={formData.seniorityNumber} onChange={handleChange} required />
        </label>
        <label>
          Square Feet:
          <input type="text" name="squareFeet" value={formData.squareFeet} onChange={handleChange} required />
        </label>
        <label>
          Total Amount:
          <input type="text" name="totalAmount" value={formData.totalAmount} onChange={handleChange} required />
        </label>
        <label>
          Paid Amount:
          <input type="text" name="paidAmount" value={formData.paidAmount} onChange={handleChange} />
        </label>
        <label>
          Pending Amount:
          <input type="text" name="pendingAmount" value={formData.pendingAmount} onChange={handleChange} />
        </label>
        <label>
          Commission:
          <input type="text" name="commission" value={formData.commission} onChange={handleChange} />
        </label>
        <label>
          Aadhar File:
          <input type="file" name="aadharFile" onChange={handleChange} />
        </label>
        <label>
          Pancard File:
          <input type="file" name="pancardFile" onChange={handleChange} />
        </label>
        <label>
          Photo File:
          <input type="file" name="photoFile" onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CustomerForm;
