import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8800';

// Public axios instance - no authentication required
const publicAxiosInstance = axios.create({
  baseURL,
  withCredentials: false, // No credentials needed for public APIs
});

export default publicAxiosInstance;
