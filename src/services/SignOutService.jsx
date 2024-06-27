import axiosInstance from './Axios';

const signOut = async () => {
  try {
    // Obtener el token del usuario actual
    const currentUserResponse = await axiosInstance.get('/current_user');
    const token = currentUserResponse.data.token;

    // Hacer la solicitud de sign out usando el token
    const response = await axiosInstance.delete('/signout', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('SignOut successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error signing out:', error);
    console.log('Error response:', error.response);
    throw error;
  }
};

export default signOut;
