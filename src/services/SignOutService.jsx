import axiosInstance from './Axios';

const signOut = async () => {
  try {
    const response = await axiosInstance.delete('/signout', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    // console.log('SignOut successful:', response.data);
    return response.data;
  } catch (error) {
    // console.error('Error signing out:', error);
    throw error;
  }
};

export default signOut;
