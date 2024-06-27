import axiosInstance from './Axios.jsx';

const signUp = async (email, password) => {
  try {
    const response = await axiosInstance.post('/signup', {
      user: {
        email,
        password,
      },
    });
    console.log('SignUp successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    console.log('Error response:', error.response);
    throw error;
  }
};

export default signUp;
