import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import '../styles/Header.css';
import logo from '../assets/dc.png';

const Header = ({ auth, setAuth }) => {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [managersDropdownOpen, setManagersDropdownOpen] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (setDropdown) => {
    setDropdown(prevState => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/');
  };

  const handleRestrictedNavigation = (event, path) => {
    if (!auth) {
      event.preventDefault();
      setShowLoginMessage(true);
      setTimeout(() => setShowLoginMessage(false), 3000);
    } else {
      navigate(path);
    }
  };

  return (
    <header>
      <section className='image'>
        <img src={logo} alt='logo' height={150} width={110} />
        <div className='user-role'>
          {auth ? (auth === 'admin' ? 'Admin Login' : 'Guest Login') : 'Login'}
        </div>
      </section>
      <nav>
        <div className="login">
          {!auth ? (
            <Link to="/login">
              <FontAwesomeIcon icon={faUser} size="2x" /> 
            </Link>
          ) : (
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faUser} size="2x" />
            </button>
          )}
        </div>
        <Link to="/">Home</Link>

        <div className="dropdown" onMouseEnter={() => toggleDropdown(setProjectsDropdownOpen)} onMouseLeave={() => toggleDropdown(setProjectsDropdownOpen)}>
          <span className="dropbtn">Projects</span>
          <div className={`dropdown-content ${projectsDropdownOpen ? 'show' : ''}`}>
            <Link to="/projects/project1" onClick={(e) => handleRestrictedNavigation(e, '/projects/project1')}>Krishna Green Midlake III</Link>
            <Link to="/projects/project2" onClick={(e) => handleRestrictedNavigation(e, '/projects/project2')}>Krishna Green North Star</Link>
          </div>
        </div>

        {auth === 'admin' && (
          <div className="dropdown" onMouseEnter={() => toggleDropdown(setManagersDropdownOpen)} onMouseLeave={() => toggleDropdown(setManagersDropdownOpen)}>
            <span className="dropbtn">Option</span>
            <div className={`dropdown-content ${managersDropdownOpen ? 'show' : ''}`}>
              <Link to="/download" onClick={(e) => handleRestrictedNavigation(e, '/download')}>View/Download</Link>
            </div>
          </div>
        )}

        <Link to="/document" onClick={(e) => handleRestrictedNavigation(e, '/document')}>Documentation</Link>
        <Link to="/payslipform" onClick={(e) => handleRestrictedNavigation(e, '/payslipform')}>PayslipForm</Link>
        <Link to="/payment-installment" onClick={(e) => handleRestrictedNavigation(e, '/payment-installment')}>Make Payment</Link>
        <Link to="/contact">Contact</Link>
        
        
      </nav>
      {showLoginMessage && (
        <div className="login-message">
          To view More Details "Please Login"
        </div>
      )}
    </header>
  );
};

export default Header;
