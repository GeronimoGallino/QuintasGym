import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pagosService } from '../services/pagos.service';
import { clientesService } from '../services/clientes.service';

const HistorialCliente = () => {
  const { id } = useParams(); // ID del cliente
  const navigate = useNavigate();
  
  const [pagos, setPagos] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Cargamos datos del cliente (para poner el nombre en el título)
        const dataCliente = await clientesService.getById(id);
        setCliente(dataCliente);

        // 2. Cargamos SU historial de pagos
        const dataPagos = await pagosService.getHistorialCliente(id);
        setPagos(dataPagos);
        
      } catch (error) {
        alert("Error cargando historial.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  // Función visual para fechas
  const formatearFecha = (fechaString) => {
    const fecha = new Date(fechaString);
    return {
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
  };

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <div>
            <h1 className="text-xl font-bold text-white">Historial de Pagos</h1>
            {cliente && <p className="text-sm text-gray-400">{cliente.nombre_completo}</p>}
        </div>
      </div>

      {/* Lista de Pagos del Cliente */}
      <div className="flex flex-col gap-3">
        
        {loading && <p className="text-center text-gray-500 mt-10">Buscando comprobantes...</p>}

        {!loading && pagos.map((pago) => {
            const { fecha, hora } = formatearFecha(pago.fecha_pago);
            
            return (
                <div 
                    key={pago.id} 
                    className="bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-md flex justify-between items-center"
                >
                    {/* IZQUIERDA: Fecha y Método */}
                    <div>
                        <p className="text-white font-bold text-lg">
                            📅 {fecha}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            Hora: {hora} hs
                        </p>
                        <span className="text-[10px] text-gray-300 bg-gray-700 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wide">
                            {pago.metodo_pago}
                        </span>
                    </div>

                    {/* DERECHA: Dinero y Concepto */}
                    <div className="text-right flex flex-col items-end">
                        <span className="text-green-400 font-bold text-xl">
                            ${pago.monto}
                        </span>
                        <span className="text-blue-200 text-xs font-medium">
                            {pago.cantidad_meses} {pago.cantidad_meses === 1 ? 'Mes' : 'Meses'}
                        </span>
                    </div>
                </div>
            );
        })}

        {!loading && pagos.length === 0 && (
            <div className="text-center mt-10 p-6 bg-gray-800 rounded-xl opacity-70">
                <p className="text-4xl mb-2">🤷‍♂️</p>
                <p className="text-white font-bold">Sin registros</p>
                <p className="text-gray-400 text-sm">Este cliente nunca ha pagado.</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default HistorialCliente;