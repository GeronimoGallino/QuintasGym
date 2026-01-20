// src/components/DetallePagoTicket.jsx
import React from 'react';
import { formatearFecha, formatearFechaYHora } from '../utils/dateUtils';

const DetallePagoTicket = ({ pago, onClose, onSolicitarEliminacion }) => {
  if (!pago) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
        
        {/* Tarjeta del Modal */}
        <div className="bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden transform transition-all scale-100">
            
            {/* Cabecera */}
            <div className="bg-orange-600 p-4 text-center">
                <h2 className="text-white font-bold text-xl">Comprobante de Pago</h2>
                <p className="text-orange-100 text-sm opacity-80">#{pago.id}</p>
            </div>

            <div className="p-6 flex flex-col gap-4">
                
                {/* Monto Gigante */}
                <div className="text-center border-b border-gray-700 pb-4">
                    <p className="text-gray-400 text-sm mb-1">Monto Abonado</p>
                    <p className="text-4xl font-black text-green-400 tracking-tight">
                        ${pago.monto}
                    </p>
                    <span className="inline-block mt-2 bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full capitalize">
                        {pago.metodo_pago}
                    </span>
                </div>

                {/* Datos del Cliente y Fechas */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="col-span-2">
                        <p className="text-gray-500 text-xs">Cliente</p>
                        <p className="text-white font-bold text-lg capitalize">
                            {pago.Cliente ? pago.Cliente.nombre_completo : 'Cliente Eliminado'}
                        </p>
                        <p className="text-gray-400">{pago.Cliente?.dni}</p>
                    </div>

                    {/* USAMOS TUS UTILS AQUÍ */}
                    <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700/50">
                        <p className="text-orange-400 text-xs font-bold mb-1">INICIO</p>
                        <p className="text-white font-mono">
                            {formatearFecha(pago.fecha_inicio_cobertura)}
                        </p>
                    </div>

                    <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700/50">
                        <p className="text-orange-400 text-xs font-bold mb-1">FIN (Vence)</p>
                        <p className="text-white font-mono">
                            {formatearFecha(pago.fecha_fin_cobertura)}
                        </p>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500 mt-2">
                    Registrado el {formatearFechaYHora(pago.fecha_pago).fecha} a las {formatearFechaYHora(pago.fecha_pago).hora} hs
                </div>
            </div>

            {/* Footer con Botones */}
            <div className="bg-gray-900/50 p-4 flex gap-3">
                <button 
                    onClick={onSolicitarEliminacion}
                    className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-3 rounded-xl font-medium transition-colors border border-red-900/50"
                >
                    🗑️ Eliminar
                </button>
                <button 
                    onClick={onClose}
                    className="flex-[2] bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold transition-colors"
                >
                    Cerrar
                </button>
            </div>

        </div>
    </div>
  );
};

export default DetallePagoTicket;