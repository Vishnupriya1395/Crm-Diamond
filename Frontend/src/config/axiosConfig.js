// axiosConfig.js
import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL of your backend API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to handle responses globally
axiosInstance.interceptors.response.use(
  function (response) {
    // Successful response, just return the data
    return response;
  },
  function (error) {
    console.error('An error occurred:', error.message);
    
    // Check for specific error status
    if (error.response && error.response.status === 404) {
      console.error('Resource not found.');
      // Optionally, you can return a custom message or handle 404 specifically
    }

    // Always return the error to the calling site for further handling
    return Promise.reject(error);
  }
);

export default axiosInstance;
