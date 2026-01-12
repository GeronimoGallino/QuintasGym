// src/components/ClienteCard.jsx
import React from 'react';

// Recibimos "cliente" como una propiedad (prop)
const ClienteCard = ({ cliente, onClick }) => {
  return (
    <button 
        className="bg-gray-800 p-4 rounded-xl flex justify-between items-center active:bg-gray-700 transition-colors w-full"
        onClick={onClick}
    >
        {/* Nombre */}
        <span className="font-bold text-lg text-white">{cliente.nombre_completo}</span>
        
        {/* Badge de Estado */}
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            cliente.activo 
            ? 'bg-green-900 text-green-300' 
            : 'bg-red-900 text-red-300'
        }`}>
            {cliente.activo ? "ACTIVO" : "INACTIVO"}
        </span>
    </button>
  );
};

export default ClienteCard;