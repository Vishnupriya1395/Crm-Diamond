import axios from 'axios';

const addPayment = (formId, paymentData) => {
  return axios.post(`/api/forms/${formId}/payments`, paymentData);
};

export { addPayment };
