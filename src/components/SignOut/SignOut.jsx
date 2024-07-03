import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import signOut from '../../services/SignOutService';
import AlertDialog from '../AlertDialog';

const SignOut = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); // Estado para controlar el diálogo

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        setOpen(true); // Abrir el diálogo al comenzar el proceso de cierre de sesión
        await signOut();
        logout();
        // Esperar 1 segundo antes de redirigir al signin
        setTimeout(() => {
          navigate('/signin');
        }, 10000);
      } catch (error) {
        console.error('Error signing out:', error);
        navigate('/signin');
      }
    };

    handleSignOut();
  }, [navigate, logout]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <AlertDialog
        open={open}
        handleClose={handleClose}
        title="Signing Out"
        message="Signing out. Please wait..."
      />
    </div>
  );
};

export default SignOut;
