import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import ModalAcciones from '../components/ModalAcciones';
import { formatearFecha, calcularDiasDeRetraso } from '../utils/dateUtils';
const Vencidos = () => {
  const navigate = useNavigate();
  const [vencidos, setVencidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
  
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await clientesService.getVencidos(); 
        setVencidos(data);
      } catch (error) {
        console.error(error);
        alert("Error al cargar vencidos");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen">
      
      {/* Header Rojo */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate('/')} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <h1 className="text-2xl font-bold text-red-500">Vencimientos</h1>
      </div>

      {/* Lista de Tarjetas */}
      <div className="flex flex-col gap-3">
        
        {loading && <p className="text-center text-gray-400">Calculando deudas...</p>}

        {!loading && vencidos.map((cliente) => {
            
            const diasVencido = calcularDiasDeRetraso(cliente.fecha_vencimiento);

            return (
                <button 
                    key={cliente.id}
                    onClick={() => setClienteSeleccionado(cliente)}
                    className="bg-gray-800 p-4 rounded-xl flex justify-between items-center w-full active:bg-gray-700 transition-colors border-l-4 border-red-500 shadow-lg"
                >
                    {/* IZQUIERDA: Nombre y Fecha */}
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-lg text-white">
                            {cliente.nombre_completo}
                        </span>
                        <span className="text-gray-400 text-xs mt-1">
                            {/* CAMBIO AQUI: Usamos la función formatearFecha */}
                            Venció: {formatearFecha(cliente.fecha_vencimiento)}
                        </span>
                    </div>

                    {/* DERECHA: Días de atraso */}
                    <div className="flex flex-col items-end">
                        <span className="text-red-400 font-bold text-xl">
                            {diasVencido} días
                        </span>
                        <span className="text-red-900 text-[10px] font-bold uppercase tracking-wider bg-red-200 px-2 py-0.5 rounded-full mt-1">
                            Vencido
                        </span>
                    </div>
                </button>
            );
        })}

        {!loading && vencidos.length === 0 && (
            <div className="text-center mt-10 p-6 bg-gray-800 rounded-xl">
                <p className="text-4xl mb-2">✅</p>
                <p className="text-white font-bold">¡Sin deudas!</p>
                <p className="text-gray-400 text-sm">Todos los clientes están al día.</p>
            </div>
        )}
      </div>

      <ModalAcciones 
        isOpen={!!clienteSeleccionado} 
        cliente={clienteSeleccionado}
        onClose={() => setClienteSeleccionado(null)} 
        onCobrar={() => navigate(`/cobrar/${clienteSeleccionado.id}`)}
        onVerCarnet={() => navigate(`/clientes/${clienteSeleccionado.id}`)}
      />
      
    </div>
  );
};

export default Vencidos;