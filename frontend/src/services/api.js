// src/services/api.js
import axios from 'axios';
// BORRA ESTA LÍNEA: import { authService } from './auth.service'; <--- CAUSA EL BLOQUEO

const API_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://192.168.1.16:3000/api'; // O tu IP local

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // LEEMOS EL TOKEN DIRECTAMENTE DEL NAVEGADOR (Para no depender de authService)
    const token = localStorage.getItem('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // SI EL TOKEN VENCIÓ, LIMPIAMOS A MANO
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);