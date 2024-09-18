import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import '../styles/ProjectForm.css';

const Project2Form = () => {
  const location = useLocation();
  <Header />;
  const [isExistingMember, setIsExistingMember] = useState(null);
  const [existingPaidAmount, setExistingPaidAmount] = useState(0);
  const [payAmount, setPayAmount] = useState('');
  const [formData, setFormData] = useState({
    projectName: location.state?.projectName || 'Krishna Greens North Star',
    id: '',
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
    aadharFile: '',
    pancardFile: '',
    photoFile: '',
    affidavitFile: '',
    paymentTypes: [],
    paidAmounts: [],
    pendingAmounts: [],
    paymentDates: [],
    tids: [],
    bankNames: [],
    branches: [],
    commissions: [],
    paymentPercentages: [],
  });
  const [error, setError] = useState('');
  const [isCustomerSubmitted, setIsCustomerSubmitted] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  const amountBySquareFeet = {
    '30x40': '4,67,640',
    '30x50': '5,84,550',
    '40x60': '9,35,280',
    '50x80': '15,58,800',
  };

  const executivesByManager = {
    Puneeth: ['Nithin', 'Shrinidhi', 'Shyla', 'Raghu', 'Bhavya', 'Mukul'],
    Ravi: ['Shravani', 'Monty', 'Anup R', 'Priyanka', 'Anitha', 'Jagadhish', 'Madhu'],
  };

  const resetFormData = useCallback(() => {
    setFormData({
      projectName: location.state?.projectName || 'Krishna Greens North Star',
      id: '',
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
      aadharFile: '',
      pancardFile: '',
      photoFile: '',
      affidavitFile: '',
      paymentTypes: [],
      paidAmounts: [],
      pendingAmounts: [],
      paymentDates: [],
      tids: [],
      bankNames: [],
      branches: [],
      commissions: [],
      paymentPercentages: [],
    });
    setExistingPaidAmount(0);
    setPayAmount('');
    setError('');
    setIsCustomerSubmitted(false);
    setCustomerId(null);
  }, [location.state?.projectName]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    setIsExistingMember(null);
    resetFormData();
  }, [location.pathname, resetFormData]);

  const fetchLocationData = async (pincode) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        if (data[0].Status === 'Success') {
          const location = data[0].PostOffice[0];
          setFormData((prevFormData) => ({
            ...prevFormData,
            address: {
              ...prevFormData.address,
              district: location.District,
              state: location.State,
            },
          }));
        } else {
          setError('Invalid pincode');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        setError('Error fetching location data. Please try again later.');
      }
    }
  };

  const handlePincodeChange = (e) => {
    const { name, value } = e.target;

    if (name === 'postalCode' && value.length <= 6) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: value,
        },
      }));
      if (value.length === 6) {
        fetchLocationData(value);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const capitalizedValue =
      name === 'mobileNumber' ||
      name === 'alternativeMobileNumber' ||
      name === 'emailid' ||
      name === 'paymentType'
        ? value
        : capitalizeFirstLetter(value);

    if (name in formData.address) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: capitalizedValue,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: capitalizedValue,
        totalAmount: name === 'squareFeet' ? amountBySquareFeet[value] || '' : prevFormData.totalAmount,
      }));
    }
  };

  const handlePayAmountChange = (e) => {
    setPayAmount(e.target.value);
  };

  const handleMemberStatus = (status) => {
    setIsExistingMember(status);
    setError('');
  };

  const fetchMemberData = async () => {
    if (!formData.mobileNumber) {
      setError('Please enter a mobile number to fetch data.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/forms/member/${formData.mobileNumber}`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          const formattedData = {
            ...formData,
            ...data,
            date: data.date ? data.date.substring(0, 10) : '',
            dateofbirth: data.dateofbirth ? data.dateofbirth.substring(0, 10) : '',
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            emailid: data.emailid || '',
            address: {
              flatNumber: data.address.flatNumber || '',
              streetName: data.address.streetName || '',
              area: data.address.area || '',
              city: data.address.city || '',
              district: data.address.district || '',
              state: data.address.state || '',
              postalCode: data.address.postalCode || '',
              country: data.address.country || 'India',
            },
            paymentTypes: data.paymentTypes || [],
            paidAmounts: data.paidAmounts || [],
            pendingAmounts: data.pendingAmounts || [],
            paymentDates: data.paymentDates || [],
            tids: data.tids || [],
            bankNames: data.bankNames || [],
            branches: data.branches || [],
            commissions: data.commissions || [],
            paymentPercentages: data.paymentPercentages || [],
          };
  
          setFormData(formattedData);
          setExistingPaidAmount(
            data.paidAmounts.reduce((sum, amt) => sum + parseFloat(amt.replace(/,/g, '')), 0)
          );
          setError('');
        } else {
          setError('No data found for the given mobile number');
        }
      } else {
        throw new Error('Received non-JSON response from server');
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      setError('Error fetching member data. Please try again later.');
    }
  };
  

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fullAddress = `${formData.address.flatNumber || ''}, ${formData.address.streetName || ''}, ${formData.address.area || ''}, ${formData.address.city || ''}, ${formData.address.district || ''}, ${formData.address.state || ''}, ${formData.address.country || ''}`
      .trim()
      .replace(/,\s*$/, '');

    const updatedFormData = {
      ...formData,
      address: {
        ...formData.address,
        fullAddress,
      },
    };

    console.log('Submitting customer data:', updatedFormData);

    try {
      const response = await fetch('http://localhost:5000/api/customer/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData); // Log backend error
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      console.log('Customer data submitted successfully:', data);

      setCustomerId(data._id);  // Save the customer ID for adding payment installments
      setIsCustomerSubmitted(true);  // Mark customer submission as completed
    } catch (error) {
      console.error('Error submitting customer data:', error); // Log the error for debugging
      setError('Error submitting form. Please try again later.');
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    setError('');

    if (!payAmount) {
      setError('Please enter a valid payment amount.');
      return;
    }

    const total = parseFloat(formData.totalAmount.replace(/,/g, '')) || 0;
    const paid = parseFloat(existingPaidAmount) || 0;
    const newPay = parseFloat(payAmount.replace(/,/g, '')) || 0;
    const newPendingAmount = total - (paid + newPay);

    const paymentData = {
      paymentType: formData.paymentType,
      paidAmount: newPay.toLocaleString(),
      pendingAmount: newPendingAmount.toLocaleString(),
      tid: formData.tid,
      bankName: formData.bankName,
      branch: formData.branch,
      date: new Date(),
      commission: formData.commission,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/payment/add/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData); // Log backend error
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      console.log('Payment added successfully:', data);

      setFormData((prevFormData) => ({
        ...prevFormData,
        paidAmounts: [...prevFormData.paidAmounts, newPay.toLocaleString()],
        pendingAmounts: [...prevFormData.pendingAmounts, newPendingAmount.toLocaleString()],
        paymentDates: [...prevFormData.paymentDates, new Date()],
        tids: [...prevFormData.tids, formData.tid],
        bankNames: [...prevFormData.bankNames, formData.bankName],
        branches: [...prevFormData.branches, formData.branch],
        commissions: [...prevFormData.commissions, formData.commission],
      }));

      setExistingPaidAmount(paid + newPay);
      setPayAmount('');
    } catch (error) {
      console.error('Error adding payment:', error); // Log the error for debugging
      setError('Error adding payment. Please try again later.');
    }
  };

  return (
    <div className="project-form">
      <h2>{formData.projectName}</h2>
      {isExistingMember === null ? (
        <div className="member-status">
          <p>Are you an existing member?</p>
          <button onClick={() => handleMemberStatus(true)}>Yes</button>
          <button onClick={() => handleMemberStatus(false)}>No</button>
        </div>
      ) : !isCustomerSubmitted ? (
        <form onSubmit={handleCustomerSubmit}>
          {isExistingMember && (
            <label>
              Mobile Number:
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber || ''}
                onChange={handleChange}
                required
                maxLength="10"
              />
              <button type="button" onClick={fetchMemberData}>
                Fetch Data
              </button>
            </label>
          )}
          <label>
            Project Name:
            <select name="projectName" value={formData.projectName || ''} onChange={handleChange} required>
              <option value="Krishna Greens North Star">Krishna Greens North Star</option>
            </select>
          </label>

          <fieldset>
            <legend>Personal Information</legend>
            <label>
              ID:
              <input type="text" name="id" value={formData.id || ''} onChange={handleChange} />
            </label>
            <label>
              Date:
              <input type="date" name="date" value={formData.date || ''} onChange={handleChange} required />
            </label>
            <label>
              First Name:
              <input type="text" name="firstName" value={formData.firstName || ''} onChange={handleChange} required />
            </label>
            <label>
              Last Name:
              <input type="text" name="lastName" value={formData.lastName || ''} onChange={handleChange} required />
            </label>
            <label>
              Mobile Number:
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber || ''}
                onChange={handleChange}
                required
                maxLength="10"
              />
            </label>
            <label>
              Alternative Mobile Number:
              <input
                type="text"
                name="alternativeMobileNumber"
                value={formData.alternativeMobileNumber || ''}
                onChange={handleChange}
                maxLength="10"
              />
            </label>
            <label>
              Date of Birth:
              <input type="date" name="dateofbirth" value={formData.dateofbirth || ''} onChange={handleChange} required />
            </label>
            <label>
              E-Mail ID:
              <input type="email" name="emailid" value={formData.emailid || ''} onChange={handleChange} required />
            </label>
          </fieldset>

          <fieldset>
            <legend>Address</legend>
            <label>
              Flat No/House No:
              <input
                type="text"
                name="flatNumber"
                value={formData.address.flatNumber || ''}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Street Name:
              <input
                type="text"
                name="streetName"
                value={formData.address.streetName || ''}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Area:
              <input type="text" name="area" value={formData.address.area || ''} onChange={handleChange} required />
            </label>
            <label>
              City:
              <input type="text" name="city" value={formData.address.city || ''} onChange={handleChange} required />
            </label>
            <label>
              District:
              <input type="text" name="district" value={formData.address.district || ''} onChange={handleChange} required readOnly />
            </label>
            <label>
              State:
              <input type="text" name="state" value={formData.address.state || ''} onChange={handleChange} required readOnly />
            </label>
            <label>
              Postal Code:
              <input
                type="text"
                name="postalCode"
                value={formData.address.postalCode || ''}
                onChange={handlePincodeChange}
                required
                maxLength="6"
              />
            </label>
            <label>
              Country:
              <input type="text" name="country" value={formData.address.country || 'India'} onChange={handleChange} readOnly />
            </label>
          </fieldset>

          <fieldset>
            <legend>Members</legend>
            <label>
              Manager Name:
              <select name="managerName" value={formData.managerName || ''} onChange={handleChange} required>
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
              <select name="executiveName" value={formData.executiveName || ''} onChange={handleChange} required>
                <option value="">Select Executive Name</option>
                {executivesByManager[formData.managerName]?.map((executive) => (
                  <option key={executive} value={executive}>
                    {executive}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Seniority Number:
              <input
                type="text"
                name="seniorityNumber"
                value={formData.seniorityNumber || ''}
                onChange={handleChange}
                required
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Transaction Details</legend>
            <label>
              Square Feet:
              <select name="squareFeet" value={formData.squareFeet || ''} onChange={handleChange} required>
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
              <input type="text" name="totalAmount" value={formData.totalAmount || ''} onChange={handleChange} readOnly />
            </label>
          </fieldset>

          <button type="submit">Submit Customer Details</button>

          {error && <p className="error">{error}</p>}
        </form>
      ) : (
        <form onSubmit={handleAddPayment}>
          <fieldset>
            <legend>Payment Installment</legend>
            <label>
              Paid Amount:
              <input type="text" name="payAmount" value={payAmount || ''} onChange={handlePayAmountChange} required />
            </label>
            <label>
              Pending Amount:
              <input type="text" name="pendingAmount" value={formData.pendingAmounts[formData.pendingAmounts.length - 1] || ''} onChange={handleChange} readOnly />
            </label>
            <label>
              Payment Type:
              <select name="paymentType" value={formData.paymentType || ''} onChange={handleChange} required>
                <option value="">Select Payment</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="netbanking">Net Banking</option>
                <option value="dd">D.D</option>
                <option value="nach\ecs">NACH\ECS</option>
              </select>
            </label>
            <label>
              TID:
              <input type="text" name="tid" value={formData.tid || ''} onChange={handleChange} required />
            </label>
            <label>
              Bank Name:
              <input type="text" name="bankName" value={formData.bankName || ''} onChange={handleChange} required />
            </label>
            <label>
              Branch:
              <input type="text" name="branch" value={formData.branch || ''} onChange={handleChange} required />
            </label>
            <label>
              Commission:
              <select name="commission" value={formData.commission || ''} onChange={handleChange} required>
                <option value="">Select Commission Status</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
          </fieldset>

          <button type="submit">Add Payment</button>

          {error && <p className="error">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default Project2Form;
