import axios from 'axios';
import Cookies from 'js-cookie';

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8800';

const axiosInstance = axios.create({ baseURL, withCredentials: true });

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('astro-tk') || Cookies.get('adminToken'); // read token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
