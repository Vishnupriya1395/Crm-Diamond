import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Projects.css';

const Projects = () => {

  return (
    <div className="projects">
      <h2>Projects</h2>
      <ul>
        <li>
        <Link to="/projects/project1">Krishna Green Midlake III</Link>        </li>
        <li>
        <Link to="/projects/project2">Krishna Green North Star</Link>        </li>
      </ul>
    </div>
  );
};

export default Projects;
