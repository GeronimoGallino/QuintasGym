import React from 'react';

const ModalConfirmacion = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    titulo, 
    mensaje,
    textoConfirmar = "Sí, Eliminar", // Texto por defecto
    colorBoton = "bg-red-600"        // Color por defecto (Rojo)
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-sm w-full p-6 transform transition-all scale-100">
        
        {/* Icono */}
        <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorBoton} bg-opacity-20`}>
                <span className="text-3xl">⚠️</span>
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
                className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform"
            >
                Cancelar
            </button>
            
            <button 
                onClick={onConfirm}
                // Aquí usamos las variables dinámicas para el color y el texto
                className={`flex-1 ${colorBoton} text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform`}
            >
                {textoConfirmar}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModalConfirmacion;