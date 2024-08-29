import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });

      const { token, user } = response.data;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Update the auth state with the user role
      onLogin(user.role);

      // Navigate to the home page after login
      navigate('/');

    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <label>Username:</label>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <label>Password:</label>
      <input 
        type={showPassword ? 'text' : 'password'} 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <div className="show-password">
        <input 
          type="checkbox" 
          checked={showPassword} 
          onChange={() => setShowPassword(!showPassword)} 
        />
        <label>Show Password</label>
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
