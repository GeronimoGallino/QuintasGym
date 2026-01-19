// frontend/src/services/auth.service.js
import { api } from './api';

export const authService = {
  async login(username, password) {
    // Usamos api.post en lugar de fetch
    // Axios lanza error automáticamente si falla (no hace falta el if !response.ok)
    const response = await api.post('/login', { username, password });
    
    const data = response.data;

    // Si todo salió bien, guardamos el token y el usuario
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
    }

    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('usuario');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
  },
  
  getToken() {
    return localStorage.getItem('token');
  }
};