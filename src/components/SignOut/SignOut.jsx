import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import signOut from '../../services/SignOutService';

const SignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut();
        logout();
        navigate('/signin');
      } catch (error) {
        console.error('Error signing out:', error);
        navigate('/signin');
      }
    };

    handleSignOut();
  }, [navigate, logout]);

  return (
    <div>
      <p>Signing out...</p>
    </div>
  );
};

export default SignOut;
