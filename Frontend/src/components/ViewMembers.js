import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const ViewMembers = () => {
  const { projectId } = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/projects/${projectId}/members`)
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(error => console.error('Error fetching members:', error));
  }, [projectId]);

  const handleDownload = () => {
    // Convert members data to CSV
    const csv = members.map(member => Object.values(member).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectId}_members.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="view-members">
      <h2>Members of {projectId}</h2>
      <table>
        <thead>
          <tr>
            {/* Add table headers dynamically based on member data */}
            {members.length > 0 && Object.keys(members[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={index}>
              {Object.values(member).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDownload}>Download CSV</button>
    </div>
  );
};

export default ViewMembers;
