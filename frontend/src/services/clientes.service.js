// src/services/clientes.service.js
import { api } from './api';

export const clientesService = {
// 1. Modificamos crear (en realidad solo devuelve la data, la lógica va en el componente)
  create: async (datosCliente) => {
    try {
      const response = await api.post('/clientes', datosCliente);
      return response.data; // Aquí vendrá el "tipo": 'YA_EXISTE_...' o 'CREADO'
    } catch (error) {
      console.error("Error al crear:", error);
      throw error;
    }
  },

  // 2. Nueva función para REACTIVAR (Es básicamente un update forzando activo=true)
  reactivar: async (id, datosNuevos) => {
    try {
        // Combinamos los datos nuevos con activo: true
        const datosReactivacion = { ...datosNuevos, activo: true };
        const response = await api.put(`/clientes/${id}`, datosReactivacion);
        return response.data;
    } catch (error) {
        throw error;
    }
  },

  // Función para obtener todos los clientes
  getAll: async () => {
    try {
      const response = await api.get('/clientes');
      return response.data; // Devolvemos solo los datos limpios
    } catch (error) {
      console.error("Error en servicio clientes:", error);
      throw error; // Lanzamos el error para que la página decida qué hacer (mostrar alerta, etc)
    }
  },
  
  // Obtener un solo cliente por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error obteniendo cliente:", error);
      throw error;
    }
  },


  // Actualizar un cliente existente
  update: async (id, datos) => {
    try {
      // Usamos PUT para actualizar
      const response = await api.put(`/clientes/${id}`, datos);
      return response.data;
    } catch (error) {
      console.error("Error actualizando cliente:", error);
      throw error;
    }
  },

  //Traer todos los clientes vencidos

  getVencidos: async () => {
    try {
      const response = await api.get('/clientes/vencidos');
      return response.data;
    } catch (error) {
      console.error("Error obteniendo clientes vencidos:", error);
      throw error;
    }
  },

  //Eliminar (Dar de baja) Borrado lógico
  delete: async (id) => {
    try {
      
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      throw error;
    }
  }

// ...

};