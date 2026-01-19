// src/services/api.js
import axios from 'axios';

// 1. Configuración de URL
const API_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'http://192.168.1.16:3000/api'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================
// PARTE 1: REQUEST INTERCEPTOR (EL QUE ENVIÁ EL TOKEN) 📤
// ¡ESTO ES LO QUE TE FALTABA! Sin esto => Error 403
// ============================================================
api.interceptors.request.use(
  (config) => {
    // 1. Buscamos el token en el navegador
    const token = localStorage.getItem('token');
    
    // 2. Si existe, lo pegamos en la cabecera como "Bearer ..."
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// PARTE 2: RESPONSE INTERCEPTOR (EL QUE MANEJA ERRORES) 📥
// Solo debe haber UNO. Este incluye el arreglo del Login.
// ============================================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Detectamos si el error vino de intentar loguearse
    const isLoginRequest = error.config && error.config.url.includes('/login');

    // Si es error 401 (Token vencido o falso) Y NO estamos en el login...
    if (error.response && error.response.status === 401 && !isLoginRequest) {
      // ...entonces sí limpiamos sesión y redirigimos.
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);