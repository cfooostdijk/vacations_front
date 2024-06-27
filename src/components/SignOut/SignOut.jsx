import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import signOut from '../../services/SignOutService';

const SignOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut();
        navigate('/signin');
      } catch (error) {
        console.error('Error signing out:', error);
        navigate('/signin');
      }
    };

    handleSignOut();
  }, [navigate]);

  return (
    <div>
      <p>Signing out...</p>
    </div>
  );
};

export default SignOut;
