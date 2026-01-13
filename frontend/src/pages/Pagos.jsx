import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pagosService } from '../services/pagos.service'; // Importamos el servicio
import {formatearFechaYHora } from '../utils/dateUtils';


const Pagos = () => {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect limpio: Solo pide datos al servicio
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await pagosService.getAll();
        setPagos(data);
      } catch (error) {
        alert("No se pudo cargar el historial.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);


  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen">
      
      {/* Header Naranja */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/')} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <h1 className="text-2xl font-bold text-orange-500">Últimos Pagos</h1>
      </div>

      <p className="text-gray-400 text-sm mb-2">
       Historial De los últimos pagos.
      </p>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        
        {loading && <p className="text-center text-gray-500 mt-10">Cargando caja...</p>}

        {!loading && pagos.map((pago) => {
            const { fecha, hora } = formatearFechaYHora(pago.fecha_pago);
            
            return (
                <div 
                    key={pago.id} 
                    className="bg-gray-800 p-4 rounded-xl border-l-4 border-orange-500 shadow-md flex justify-between items-center"
                >
                    {/* INFO IZQUIERDA */}
                    <div>
                        <h3 className="text-white font-bold text-lg capitalize">
                            {pago.Cliente ? pago.Cliente.nombre_completo : 'Cliente Eliminado'}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                            📅 {fecha} - 🕒 {hora} hs
                        </p>
                        <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded mt-1 inline-block">
                            {pago.metodo_pago}
                        </span>
                    </div>

                    {/* INFO DERECHA (Dinero) */}
                    <div className="text-right flex flex-col items-end">
                        <span className="text-green-400 font-bold text-xl">
                            + ${pago.monto}
                        </span>
                        <span className="text-orange-200 text-xs font-medium">
                            {pago.cantidad_meses} {pago.cantidad_meses === 1 ? 'Mes' : 'Meses'}
                        </span>
                    </div>
                </div>
            );
        })}

        {!loading && pagos.length === 0 && (
            <div className="text-center mt-10 opacity-50">
                <p className="text-4xl">📭</p>
                <p className="text-gray-400 mt-2">No hay movimientos registrados.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default Pagos;