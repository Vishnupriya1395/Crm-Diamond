import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Forms = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/forms/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };

    fetchForms();
  }, []);

  return (
    <div>
      <h2>Forms</h2>
      <ul>
        {forms.map(form => (
          <li key={form._id}>{form.firstName} {form.lastName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Forms;
