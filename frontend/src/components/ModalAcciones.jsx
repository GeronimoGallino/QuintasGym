import React from 'react';

const ModalAcciones = ({ isOpen, onClose, cliente, onCobrar, onVerCarnet }) => {
  // Si no hay cliente seleccionado o no está abierto, no mostramos nada
  if (!isOpen || !cliente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      
      {/* Contenedor del Modal */}
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 max-w-sm w-full transform transition-all scale-100 flex flex-col gap-4">
        
        {/* Título */}
        <div className="text-center mb-2">
            <h3 className="text-gray-400 text-sm">Gestionar a</h3>
            <h2 className="text-2xl font-bold text-white uppercase">{cliente.nombre_completo}</h2>
        </div>

        {/* Botón COBRAR (El principal, más llamativo) */}
        <button 
            onClick={onCobrar}
            className="bg-green-600 hover:bg-green-500 text-white p-5 rounded-xl flex items-center justify-between shadow-lg active:scale-95 transition-all group"
        >
            <span className="font-bold text-lg">💸 Cobrar Cuota</span>
            <span className="text-2xl group-active:translate-x-1 transition-transform">➜</span>
        </button>

        {/* Botón VER CARNET (Secundario) */}
        <button 
            onClick={onVerCarnet}
            className="bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-xl flex items-center justify-between shadow-lg active:scale-95 transition-all group"
        >
            <span className="font-bold text-lg">👤 Ver Carnet</span>
            <span className="text-2xl group-active:translate-x-1 transition-transform">➜</span>
        </button>

        {/* Botón CANCELAR (Discreto) */}
        <button 
            onClick={onClose}
            className="mt-2 text-gray-500 py-2 font-medium active:text-white transition-colors"
        >
            Cancelar
        </button>

      </div>
    </div>
  );
};

export default ModalAcciones;