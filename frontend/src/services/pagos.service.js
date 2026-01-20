// src/services/pagos.service.js

import { api } from './api';

export const pagosService = {
  // Registrar un nuevo pago
  create: async (datosPago) => {
    // datosPago espera: { cliente_id, monto, metodo_pago, cantidad_meses }
    try {
      const response = await api.post('/pagos', datosPago);
      return response.data;
    } catch (error) {
      console.error("Error al registrar pago:", error);
      throw error;
    }
  },

  // Ver historial de un cliente (lo usaremos luego)
  getHistorialCliente: async (clienteId) => {
    try {
      const response = await api.get(`/pagos/cliente/${clienteId}`);
      return response.data;
    } catch (error) {
      console.error("Error al cargar historial:", error);
      throw error;
    }
  },

  // Obtener todos los pagos (últimos 100)
  getAll: async () => {
    try {
      // Llama a la ruta que acabamos de optimizar en el backend
      const response = await api.get('/pagos'); 
      return response.data;
    } catch (error) {
      console.error("Error al obtener pagos:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/pagos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar pago:", error);
      throw error;
    }
  }
};