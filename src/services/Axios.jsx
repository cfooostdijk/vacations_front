import axios from 'axios';

const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://vacations-back-1jco.onrender.com'
  : 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export default axiosInstance;
