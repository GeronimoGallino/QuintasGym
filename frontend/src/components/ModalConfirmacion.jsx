import React from 'react';

const ModalConfirmacion = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    titulo, 
    mensaje,
    textoConfirmar = "Sí, Eliminar",
    colorBoton = "bg-red-600",
    procesando = false // <--- 1. NUEVA PROP
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-sm w-full p-6 transform transition-all scale-100">
        
        {/* Icono */}
        <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorBoton} bg-opacity-20`}>
                {/* Si está procesando mostramos un spinner simple, sino el icono de alerta */}
                {procesando ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                ) : (
                    <span className="text-3xl">⚠️</span>
                )}
            </div>
        </div>

        {/* Textos */}
        <h3 className="text-xl font-bold text-white text-center mb-2">
            {titulo}
        </h3>
        <p className="text-gray-400 text-center text-sm mb-6">
            {mensaje}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
            <button 
                onClick={onClose}
                disabled={procesando} // <--- Deshabilitar cancelar si está borrando
                className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Cancelar
            </button>
            
            <button 
                onClick={onConfirm}
                disabled={procesando} // <--- 2. BLOQUEAR BOTÓN
                className={`flex-1 ${colorBoton} text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
            >
                {/* 3. CAMBIAR TEXTO */}
                {procesando ? 'Eliminando...' : textoConfirmar}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModalConfirmacion;