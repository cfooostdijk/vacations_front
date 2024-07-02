import axios from 'axios';

const apiUrl = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: apiUrl,
});

export default axiosInstance;
