// src/services/api.js
import axios from 'axios';

// Aquí defines tu IP una sola vez para toda la app
const API_URL = 'http://192.168.1.14:3000/api'; 

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});