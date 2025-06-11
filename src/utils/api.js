import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5015/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Send cookies with every request
});

export default api;