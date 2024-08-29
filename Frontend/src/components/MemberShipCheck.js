import React from 'react';
import { useNavigate } from 'react-router-dom';

const MembershipCheck = ({ project }) => {
  const navigate = useNavigate();

  const handleMembershipStatus = (status) => {
    if (status === 'yes') {
      navigate(`/projects/${project}/form`);
    } else {
      navigate(`/projects/${project}/form`);
    }
  };

  return (
    <div>
      <h2>Are you an existing member?</h2>
      <button onClick={() => handleMembershipStatus('yes')}>Yes</button>
      <button onClick={() => handleMembershipStatus('no')}>No</button>
    </div>
  );
};

export default MembershipCheck;
