import axios from 'axios';

const apiUrl = 'https://vacations-back-1jco.onrender.com';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export default axiosInstance;
