import React from 'react';

const ModalError = ({ isOpen, onClose, titulo, mensaje }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-red-500/50 p-8 max-w-sm w-full text-center transform transition-all scale-100 flex flex-col items-center">
        
        {/* Ícono de Error (X) */}
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.3)] animate-pulse">
            <span className="text-5xl text-red-500 font-bold">⚠️</span>
        </div>

        {/* Textos */}
        <h2 className="text-3xl font-bold text-white mb-2">
            {titulo || "Hubo un problema"}
        </h2>
        <p className="text-gray-300 text-lg mb-8">
            {mensaje || "Ocurrió un error inesperado."}
        </p>

        {/* Botón Cerrar */}
        <div className="w-full">
            <button 
                onClick={onClose}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg active:scale-95 transition-all"
            >
                Entendido
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModalError;