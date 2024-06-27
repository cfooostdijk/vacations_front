import axiosInstance from './Axios';

const signIn = async (email, password) => {
  try {
    const response = await axiosInstance.post('/signin', {
      user: {
        email,
        password,
      },
    });
    console.log('SignIn successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error signing in:', error);
    console.log('Error response:', error.response);
    throw error;
  }
};

export default signIn;
