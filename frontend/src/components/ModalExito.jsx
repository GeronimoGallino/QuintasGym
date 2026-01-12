import React from 'react';

const ModalExito = ({ isOpen, onClose, mensaje, onAccion, textoAccion }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      
      <div className="bg-gray-800 rounded-3xl shadow-2xl border border-green-500/30 p-8 max-w-sm w-full text-center transform transition-all scale-100 flex flex-col items-center">
        
        {/* Check */}
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            <span className="text-5xl text-white font-bold">✓</span>
        </div>

        {/* Textos */}
        <h2 className="text-3xl font-bold text-white mb-2">¡Operación Exitosa!</h2>
        <p className="text-gray-300 text-lg mb-8">
            {mensaje || "La operación se registró correctamente."}
        </p>

        <div className="w-full flex flex-col gap-3">
            
            {/* BOTÓN OPCIONAL (Ej: Ir a Cobrar) */}
            {/* Solo aparece si le pasamos una acción */}
            {onAccion && (
                <button 
                    onClick={onAccion}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg active:scale-95 transition-all mb-1"
                >
                    {textoAccion}
                </button>
            )}

            {/* BOTÓN CERRAR (Siempre está) */}
            <button 
                onClick={onClose}
                className={`w-full font-bold py-4 rounded-xl text-xl shadow-lg active:scale-95 transition-all ${
                    onAccion 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' // Si hay otro botón, este se vuelve "secundario" (Gris)
                    : 'bg-green-600 text-white hover:bg-green-500'   // Si está solo, es "primario" (Verde)
                }`}
            >
                {onAccion ? 'Finalizar y Salir' : 'Genial, continuar'}
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModalExito;