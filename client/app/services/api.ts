// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "api"  || '/api',
  timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

// Interceptor de errores o auth token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    console.error('API Error:', error);
    return Promise.reject();
  }
);

export default api;
