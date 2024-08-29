import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Import the logout icon
import '../styles/Header.css';
import logo from '../assets/dc.png';

const Header = ({ auth, setAuth }) => {
  const [projectsDropdownOpen, setProjectsDropdownOpen] = useState(false);
  const [managersDropdownOpen, setManagersDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = (setDropdown) => {
    setDropdown(prevState => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/');
  };

  return (
    <header>
      <section className='image'>
      <img src={logo} alt='logo' height={150} width={110} />
      </section>
      <nav>
        <div className="login">
          {!auth ? (
            <Link to="/login">
              <FontAwesomeIcon icon={faUser} size="2x" /> 
            </Link>
          ) : (
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faUser} size="2x" /> {/* Use the logout icon */}
            </button>
          )}
        </div>
        <Link to="/">Home</Link>

        {/* Projects Dropdown (Visible for all users) */}
        <div className="dropdown" onMouseEnter={() => toggleDropdown(setProjectsDropdownOpen)} onMouseLeave={() => toggleDropdown(setProjectsDropdownOpen)}>
          <span className="dropbtn">Projects</span>
          <div className={`dropdown-content ${projectsDropdownOpen ? 'show' : ''}`}>
            <Link to="/projects/project1">Krishna Green Midlake III</Link>
            <Link to="/projects/project2">Krishna Green North Star</Link>
          </div>
        </div>

        {/* Option Dropdown (Visible only for admin users) */}
        {auth === 'admin' && (
          <div className="dropdown" onMouseEnter={() => toggleDropdown(setManagersDropdownOpen)} onMouseLeave={() => toggleDropdown(setManagersDropdownOpen)}>
            <span className="dropbtn">Option</span>
            <div className={`dropdown-content ${managersDropdownOpen ? 'show' : ''}`}>
              <Link to="/download">View/Download</Link>
            </div>
          </div>
        )}

        <Link to="/document">Documentation</Link>
        <Link to="/payslipform">PayslipForm</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
