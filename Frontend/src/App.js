import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Project1Form from './components/Project1Form';
import Project2Form from './components/Project2Form';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Documentation from './components/Documentation';
import DownloadPage from './components/DownloadPage';
import PaymentInstallmentForm from './components/PaymentInstallmentForm'; 
import PayslipForm from './components/PayslipForm';
import PaymentDetails from './components/PaymentDetails';



function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Attempt to decode the token to get the user role
        const user = JSON.parse(atob(token.split('.')[1]));
        // Set the auth state with the user role
        setAuth(user.role);
      } catch (error) {
        console.error("Token decode error", error);
        // Clear the invalid token and auth state if decoding fails
        localStorage.removeItem('token');
        setAuth(null);
      }
    } else {
      // If no token is found, ensure auth is null
      setAuth(null);
    }

    // Optionally, clear the token and auth state on component mount
   
  }, []);

  return (
    <Router>
      <div className="App">
        <Header auth={auth} setAuth={setAuth} />
        <main>
          <Routes>
            <Route path="/" element={auth ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login onLogin={setAuth} />} />
            <Route path="/projects/project1" element={auth ? <Project1Form /> : <Navigate to="/login" />} />
            <Route path="/projects/project2" element={auth ? <Project2Form /> : <Navigate to="/login" />} />
            <Route path="/payment-installment" element={auth ? <PaymentInstallmentForm /> : <Navigate to="/login" />} />
            {auth === 'admin' && (
              <Route path="/download" element={<DownloadPage />} />
            )}
            <Route path="/contact" element={<Contact />} />
            <Route path="/document" element={auth ? <Documentation /> : <Navigate to="/login" />} />
            <Route path="/payslipform" element={auth ? <PayslipForm /> : <Navigate to="/login" />} />
            {auth === 'admin' && (
              <Route path="/payment-details/:id" element={<PaymentDetails />} />
            )}
          
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
