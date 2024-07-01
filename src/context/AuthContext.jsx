// AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Aquí podrías implementar lógica para mantener la sesión activa si es necesario
    // Por ejemplo, cargar el token desde el almacenamiento local al iniciar la aplicación
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const login = (token) => {
    setAuthToken(token);
    localStorage.setItem('authToken', token); // Almacena el token en el almacenamiento local
    console.log(token)
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('authToken'); // Elimina el token del almacenamiento local al cerrar sesión
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
