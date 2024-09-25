import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import '../styles/ProjectForm.css';

const Project1Form = () => {
  const navigate=useNavigate();
  const location = useLocation();
  const [isExistingMember, setIsExistingMember] = useState(null);
  const [formData, setFormData] = useState({
    projectName: location.state?.projectName || 'Krishna Greens MidLake III',
    id: '',
    date: '',
    name: {
      firstName: '',
      lastName: '',
    },
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
    assistantManagerName:'',
    executiveName: '',
    seniorityNumber: '',
    squareFeet: '',
    totalAmount: '',
  });

  const [error, setError] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const amountBySquareFeet = {
    '30x40': '4,67,640',
    '30x50': '5,84,550',
    '40x60': '9,35,280',
    '50x80': '15,58,800',
  };

  const executivesByManager = {
    Puneeth: ['Raghu Gowda','Bhavya','Shyla K','Suhail Pasha','Sushma Gowda','Mukul Rajkumar','Mamtha Parida'],
    Ravi: ['Shravani', 'Anitha Y','Priyanka','Arjun Vasudev','Madhu Raj','Faizal','Syed Sahil'],
    Suraj:['Asha','Priyadharshini','Ramesh','Lavanya','JayaPrakash'],
    Jagadisha :['Nithin'],
  };

  const assistantManagerByManager = {
    Puneeth: 'Anup R',
    Ravi: 'Shrinidhi G S',
    Suraj: 'Monty M V',
    Jagadisha: 'Nithin J',
  };

  const resetFormData = useCallback(() => {
    setFormData({
      projectName: location.state?.projectName || 'Krishna Greens Mid Lake III',
      id: '',
      date: '',
      name: {
        firstName: '',
        lastName: '',
      },
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
      assistantManagerName:'',
      executiveName: '',
      seniorityNumber: '',
      squareFeet: '',
      totalAmount: '',
    });
    setIsExistingMember(null);
    setError('');
  }, [location.state?.projectName]);

  useEffect(() => {
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
      name === 'emailid'
        ? value
        : value.charAt(0).toUpperCase() + value.slice(1);

    if (name in formData.address) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: capitalizedValue,
        },
      }));
    } else if (name in formData.name) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: {
          ...prevFormData.name,
          [name]: capitalizedValue,
        },
      }));
    }else if(name === 'managerName'){
      setFormData((prevFormData) =>(
      {
        ...prevFormData,
        [name]: value,
        assistantManagerName: assistantManagerByManager[value] || '',
      }));
    } 
    else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: capitalizedValue,
        totalAmount: name === 'squareFeet' ? amountBySquareFeet[value] || '' : prevFormData.totalAmount,
      }));
    }
  };

  const handleMemberStatus = (status) => {
    setIsExistingMember(status);
    setError('');
  };
  const fetchMemberData = async () => {
    try {
      const response = await axios.get(`http://diamondcrown.org:/api/forms/member/${formData.mobileNumber}`);

      if (response.status !==200) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = response.data;

      if (data && Object.keys(data).length > 0) {
        const formattedData = {
          ...formData,
          ...data,
          date: data.date ? data.date.substring(0, 10) : '',
          dateofbirth: data.dateofbirth ? data.dateofbirth.substring(0, 10) : '',
          name: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
          },
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
          managerName: data.managerName || '',
          assistantManagerName: assistantManagerByManager[data.managerName] || '',

        };

        setFormData(formattedData);
        setError('');
      } else {
        setError('No data found for the given mobile number');
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      setError('Error fetching member data. Please try again later.');
    }
  };


  
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(''); 
  
    try {
      const response = await fetch('http://diamondcrown.org:/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message.includes('duplicate key error')) {
          setMessage('Mobile number already exists. Try a different mobile number.');
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 3000); // Hide message box after 3 seconds
          return;
        }
        throw new Error(errorData.message || 'Network response was not ok');
      }
      const data = await response.json();
      console.log('Form submitted successfully:', data);
      alert('Form Submitted Successfully');
      setIsSubmitted(true); 
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Mobile number already exists. Try a different mobile number.');
    }
  };

  

  const handleAddPayment = async () => {
    const paymentData = {
      paymentAmount: parseFloat(formData.paidAmount) || 0,
      paymentType: formData.paymentType,
      paymentDate: formData.paymentDate,
      bankName: formData.bankName,
      branchName: formData.branchName,
      transactionId: formData.transactionId,
      commission: formData.commission,
      paymentPercentage: ((parseFloat(formData.paidAmount) / parseFloat(formData.totalAmount)) * 100).toFixed(2),
      pendingAmount: (parseFloat(formData.totalAmount) - parseFloat(formData.paidAmount)).toFixed(2),
    };
  
    try {
      const response = await axios.post(`http://diamondcrown.org/api/forms/${formData.mobileNumber}/payments`, paymentData); // Using mobileNumber in the request
      if (response.status === 201) {
        setFormData(prevData => ({
          ...prevData,
          payments: [...prevData.payments, response.data],
          paidAmount: '',
          paymentType: '',
          paymentDate: '',  // Clear paymentDate after submission
          bankName: '',
          branchName: '',
          transactionId: '',
          commission: '',
          paymentPercentage: ((totalPaidAmount / prevData.totalAmount) * 100).toFixed(2) + '%',
          pendingAmount: (prevData.totalAmount - totalPaidAmount).toFixed(2),
        }));
      }
    } catch (error) {
      console.error('Error submitting payment data:', error);
      setError('Error submitting payment data. Please try again later.');
    }
  };
 
  const handleMakePayment = () => {
    // Navigate to the PaymentInstallmentForm and pass mobileNumber
    navigate('/payment-installment', {
      state: {
        mobileNumber: formData.mobileNumber,  // Pass the mobile number to PaymentInstallmentForm
      },
    });
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
      ) : (
        <form onSubmit={handleSubmit}>
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
            {isExistingMember && (
              <button type="button" onClick={fetchMemberData}>
                Fetch Data
              </button>
            )}
          </label>
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
              <input type="text" name="firstName" value={formData.name.firstName || ''} onChange={handleChange} required />
            </label>
            <label>
              Last Name:
              <input type="text" name="lastName" value={formData.name.lastName || ''} onChange={handleChange} required />
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
              District:
              <input type="text" name="district" value={formData.address.district || ''} onChange={handleChange} required readOnly />
            </label>
            <label>
              State:
              <input type="text" name="state" value={formData.address.state || ''} onChange={handleChange} required readOnly />
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
              Assistant Manager Name:
              <input type='text' name='assistantManagerName' value={formData.assistantManagerName || ''} onChange={handleChange} readOnly />
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

          <button type="submit">Submit Form</button>
          <button type="button" onClick={handleMakePayment}>Make Payment</button>
          {error && <p className="error">{error}</p>}
          {showMessage && (
        <div className="message-box">
          <p>{message}</p>
        </div>
      )}
        </form>
        
      )}
    </div>
  );
};

export default Project1Form;
