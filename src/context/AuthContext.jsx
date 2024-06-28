// AuthContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axiosInstance from '../services/Axios';

// Crea el contexto de autenticación
export const AuthContext = createContext();

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Función para realizar login (signin)
  const signin = useCallback(async (credentials) => {
    try {
      const response = await axiosInstance.post('/signin', credentials);
      const authToken = response.data.token; // Suponiendo que el token se devuelve en la respuesta
      const userData = response.data.user; // Datos del usuario
      setCurrentUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
    } catch (error) {
      console.error('Error during signin:', error);
      throw error; // Puedes manejar el error según tu lógica de la aplicación
    }
  }, []);

  // Función para realizar signup
  const signup = useCallback(async (userData) => {
    try {
      const response = await axiosInstance.post('/signup', userData);
      const authToken = response.data.token; // Suponiendo que el token se devuelve en la respuesta
      setCurrentUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
    } catch (error) {
      console.error('Error during signup:', error);
      throw error; // Puedes manejar el error según tu lógica de la aplicación
    }
  }, []);

  // Función para realizar logout
  const signout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }, []);

  // Verifica el token y obtiene el usuario actual al cargar la página
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/current_user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data.user); // Actualiza currentUser con los datos del usuario
      } catch (error) {
        console.error('Error fetching user data:', error);
        signout(); // Limpia el estado de autenticación en caso de error
      }
    };

    if (token) {
      fetchCurrentUser();
    }
  }, [token, signout]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        signin,
        signup,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => useContext(AuthContext);
