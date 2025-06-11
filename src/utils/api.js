import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5015/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;