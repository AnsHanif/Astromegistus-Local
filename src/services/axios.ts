import axios from 'axios';

export const baseURL = 'http://localhost:8800';

const axiosInstance = axios.create({ baseURL, withCredentials: true });

export default axiosInstance;
