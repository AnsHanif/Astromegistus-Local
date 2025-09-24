import axios from 'axios';
import Cookies from 'js-cookie';

export const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8800';

const adminAxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

// Add admin token to every request
adminAxiosInstance.interceptors.request.use((config) => {
  const adminToken = Cookies.get('adminToken');
  console.log('Admin token from cookies:', adminToken);
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
    console.log(
      'Added admin token to request headers:',
      config.headers.Authorization
    );
  } else {
    console.warn('No admin token found in cookies');
  }
  return config;
});

// Handle 401 errors and redirect to login
adminAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Admin token expired or invalid, redirecting to login');
      Cookies.remove('adminToken');
      sessionStorage.removeItem('isAdmin');
      sessionStorage.removeItem('adminInfo');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminAxiosInstance;
