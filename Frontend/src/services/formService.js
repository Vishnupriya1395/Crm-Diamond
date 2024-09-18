import axios from 'axios';

const submitForm = (formData) => {
  return axios.post('/api/forms/submit', formData);
};

const fetchFormByMobile = (mobileNumber) => {
  return axios.get(`/api/forms/member/${mobileNumber}`);
};

export { submitForm, fetchFormByMobile };
