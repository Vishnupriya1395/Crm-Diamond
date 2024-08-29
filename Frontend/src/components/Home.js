import React from 'react';
import plotImage from '../assets/plot.png'; // Adjust this path as needed

import '../styles/Home.css';

const Home = () => {
  return (
    <div className='div-container'> 
   
      <img src={plotImage} alt="plot" height={800}  width={1800}/> 
    </div>
  );
};

export default Home;
