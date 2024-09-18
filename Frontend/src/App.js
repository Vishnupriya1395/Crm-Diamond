import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Project1Form from './components/Project1Form';
import Project2Form from './components/Project2Form';
import Payments from './components/Payments';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Documentation from './components/Documentation';
import DownloadPage from './components/DownloadPage';
import NewPayment from './components/NewPayment';
import PayslipForm from './components/PayslipForm';


function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(atob(token('.')[1]));
        setAuth(user.role);
      } catch (error) {
        console.error("Token decode error", error);
        setAuth(null);
      }
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Header auth={auth} setAuth={setAuth} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={setAuth} />} />
            <Route path="/projects/project1" element={<Project1Form />} />
            <Route path="/projects/project2" element={<Project2Form />} />
            <Route path="/projects/project1/payment" element={<Payments />} />
            <Route path="/projects/project2/payment" element={<Payments />} />
            <Route path="/newpayment" element={<NewPayment />} />
            {auth === 'admin' && (
              <Route path="/download" element={<DownloadPage />} />
            )}
            <Route path="/contact" element={<Contact />} />
            <Route path="/document" element={<Documentation />} />
            <Route path="/payslipform" element={<PayslipForm />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
