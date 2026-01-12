import React from 'react';

const ModalExito = ({ isOpen, onClose, mensaje }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      
      {/* Tarjeta del Modal */}
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-green-500/30 p-8 max-w-sm w-full text-center transform transition-all scale-100 flex flex-col items-center">
        
        {/* Círculo Animado con Check */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <span className="text-5xl text-white font-bold">✓</span>
        </div>

        {/* Título y Mensaje */}
        <h2 className="text-3xl font-bold text-white mb-2">¡Operación Exitosa!</h2>
        <p className="text-gray-300 text-lg mb-8">
            {mensaje || "La operación se registró correctamente."}
        </p>

        {/* Botón Continuar */}
        <button 
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg active:scale-95 transition-all"
        >
            Genial, continuar
        </button>

      </div>
    </div>
  );
};

export default ModalExito;