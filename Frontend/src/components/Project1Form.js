import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/ProjectForm.css';

const Project1Form = () => {
  const navigate = useNavigate(); // Use navigate for navigation
  const [isExistingMember, setIsExistingMember] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    id: '',
    date: '',
    firstName: '',
    lastName: '',
    mobileNumber: '',
    alternativeMobileNumber: '',
    dateofbirth: '',
    emailid: '',
    address: '',
    managerName: '',
    executiveName: '',
    seniorityNumber: '',
    squareFeet: '',
    totalAmount: '',
    paymentType: '', // Ensure paymentType is included
    paidAmount: '',
    pendingAmount: '',
    tid: '',
    bankName: '',
    branch: '',
    paymentPercentage: '',
    commission: '',
  });
  const [error, setError] = useState('');

  const amountBySquareFeet = {
    '30x40': '3,95,640',
    '30x50': '4,94,550',
    '40x60': '7,91,280',
    '50x80': '13,18,800',
    '80x100': '26,37,600',
    '100x120': '39,56,400',
  };

  const executivesByManager = {
    Puneeth: ['Nithin', 'Shrinidhi', 'Shyla', 'Raghu', 'Bhavya', 'Mukul'],
    Ravi: ['Shravani', 'Monty', 'Anup R', 'Priyanka', 'Anitha', 'Jagadhish', 'Madhu'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      totalAmount: name === 'squareFeet' ? amountBySquareFeet[value] || '' : prevFormData.totalAmount,
    }));
  };

  const handleMemberStatus = async (status) => {
    setIsExistingMember(status);
    if (status) {
      try {
        const response = await fetch(`http://localhost:5000/api/forms/member/${formData.mobileNumber}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error fetching member data:', error);
        setError('Error fetching member data. Please try again later.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/forms/submit', {
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
      console.log('Form submitted:', data);

      // Clear the form data
      setFormData({
        projectName: '',
        id: '',
        date: '',
        firstName: '',
        lastName: '',
        mobileNumber: '',
        alternativeMobileNumber: '',
        dateofbirth: '',
        emailid: '',
        address: '',
        managerName: '',
        executiveName: '',
        seniorityNumber: '',
        squareFeet: '',
        totalAmount: '',
        paymentType: '', // Reset paymentType
        paidAmount: '',
        pendingAmount: '',
        tid: '',
        bankName: '',
        branch: '',
        paymentPercentage: '',
        commission: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error submitting form. Please try again later.');
    }
  };

  const handleMakePaymentClick = () => {
    navigate(`/projects/project1/payment?mobileNumber=${formData.mobileNumber}`);
  };

  useEffect(() => {
    if (formData.totalAmount && formData.paidAmount) {
      const total = parseFloat(formData.totalAmount.replace(/,/g, '')) || 0;
      const paid = parseFloat(formData.paidAmount.replace(/,/g, '')) || 0;
      const percentage = ((paid / total) * 100).toFixed(2);
      const pending = total - paid;
      setFormData((prevFormData) => ({
        ...prevFormData,
        paymentPercentage: `${percentage}%`,
        pendingAmount: pending.toLocaleString(),
      }));
    }
  }, [formData.totalAmount, formData.paidAmount]);

  return (
    <div className="project-form">
      <h2>Krishna Greens Midlake III</h2>
      {isExistingMember === null ? (
        <div className="member-status">
          <p>Are you an existing member?</p>
          <button onClick={() => handleMemberStatus(true)}>Yes</button>
          <button onClick={() => handleMemberStatus(false)}>No</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {isExistingMember && (
            <label>
              Mobile Number:
              <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required />
              <button type="button" onClick={() => handleMemberStatus(true)}>Fetch Data</button>
            </label>
          )}
          <label>
            Project Name:
            <select name="projectName" value={formData.projectName} onChange={handleChange} required>
              <option value="Krishna Greens MidLake III">Krishna Greens MidLake III</option>
            </select>
          </label>

          <fieldset>
            <legend>Personal Information</legend>
            <label>
              ID:
              <input type="text" name="id" value={formData.id} onChange={handleChange} required />
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
              <input type="text" name="alternativeMobileNumber" value={formData.alternativeMobileNumber} onChange={handleChange} required />
            </label>
            <label>
              Date of Birth:
              <input type="date" name="dateofbirth" value={formData.dateofbirth} onChange={handleChange} required />
            </label>
            <label>
              E-Mail ID:
              <input type="email" name="emailid" value={formData.emailid} onChange={handleChange} required />
            </label>
            <label>
              Address:
                <textarea  name="address" value={formData.address} onChange={handleChange} required rows="5"/>
            </label>
          </fieldset>
          <fieldset>
            <legend>Members</legend>
            <label>
              Manager Name:
              <select name="managerName" value={formData.managerName} onChange={handleChange} required>
                <option value="">Select Manager Name</option>
                {Object.keys(executivesByManager).map((manager) => (
                  <option key={manager} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Executive Name:
              <select name="executiveName" value={formData.executiveName} onChange={handleChange} required>
                <option value="">Select Executive Name</option>
                {(executivesByManager[formData.managerName] || []).map((executive) => (
                  <option key={executive} value={executive}>
                    {executive}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>
          <fieldset>
            <legend>Plot Details</legend>
            <label>
              Seniority Number:
              <input type="text" name="seniorityNumber" value={formData.seniorityNumber} onChange={handleChange} />
            </label>
            <label>
              Square Feet:
              <select name="squareFeet" value={formData.squareFeet} onChange={handleChange} required>
                <option value="">Select Square Feet</option>
                {Object.keys(amountBySquareFeet).map((squareFeet) => (
                  <option key={squareFeet} value={squareFeet}>
                    {squareFeet}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Total Amount:
              <input type="text" name="totalAmount" value={formData.totalAmount} onChange={handleChange} readOnly />
            </label>
          </fieldset>
          <fieldset>
            <legend>Payment Details</legend>
            <label>
              Payment Type:
              <select name="paymentType" value={formData.paymentType} onChange={handleChange} required>
                <option value="">Select Payment</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="netbanking">Net Banking</option>
                <option value="dd">D.D</option>
                <option value="nach\ecs">NACH\ECS</option>
              </select>
            </label>
            <label>
              Paid Amount:
              <input type="text" name="paidAmount" value={formData.paidAmount} onChange={handleChange} required />
            </label>
            <label>
              Pending Amount:
              <input type="text" name="pendingAmount" value={formData.pendingAmount} onChange={handleChange} readOnly />
            </label>
            <label>
              Tid / C.no / DD:
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
            <input type="text" name="paymentPercentage" value={formData.paymentPercentage} onChange={handleChange} readOnly />
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
            <button type="submit">Submit</button>
            {isExistingMember && (
              <button type="button" onClick={handleMakePaymentClick}>Make Payment</button>
            )}
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      )}
    </div>
  );
};

export default Project1Form;
