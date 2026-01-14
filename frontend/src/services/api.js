// src/services/api.js
import axios from 'axios';

// LÓGICA INTELIGENTE:
// 1. Si existe una variable de entorno (Render), úsala.
// 2. Si no, usa localhost (Tu PC).
const API_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` // En Render
    : 'http://192.168.1.19:3000/api';          // En tu casa

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});