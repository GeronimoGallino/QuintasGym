import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import ModalAcciones from '../components/ModalAcciones';
import { formatearFecha, calcularDiasDeRetraso } from '../utils/dateUtils';

const Vencidos = () => {
  const navigate = useNavigate();
  
  // Estados de datos
  const [vencidos, setVencidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // 1. NUEVO ESTADO PARA EL BUSCADOR
  const [busqueda, setBusqueda] = useState(""); 
  
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

  // 2. LÓGICA DE FILTRADO
  const vencidosFiltrados = vencidos.filter(cliente => 
    cliente.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen max-w-2xl mx-auto w-full">
      
      {/* Header Rojo */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/')} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <h1 className="text-2xl font-bold text-red-500">Vencimientos</h1>
      </div>

      {/* 3. INPUT BUSCADOR (Igual al de Clientes) */}
      <div className="relative">
        <input 
            type="text" 
            placeholder="Buscar deudor por nombre..." 
            className="w-full p-4 pl-12 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-red-500 transition-colors"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="absolute left-4 top-4 text-gray-400">🔍</span>
      </div>

      {/* Lista de Tarjetas */}
      <div className="flex flex-col gap-3">
        
        {loading && <p className="text-center text-gray-400">Calculando deudas...</p>}

        {/* 4. RENDERIZAMOS LA LISTA FILTRADA */}
        {!loading && vencidosFiltrados.map((cliente) => {
            
            const diasVencido = calcularDiasDeRetraso(cliente.fecha_vencimiento);

            return (
                <button 
                    key={cliente.id}
                    onClick={() => setClienteSeleccionado(cliente)}
                    className="bg-gray-800 p-4 rounded-xl flex justify-between items-center w-full active:bg-gray-700 transition-colors border-l-4 border-red-500 shadow-lg"
                >
                    {/* IZQUIERDA: Nombre y Fecha */}
                    <div className="flex flex-col items-start">
                        <span className="font-bold text-lg text-white text-left">
                            {cliente.nombre_completo}
                        </span>
                        <span className="text-gray-400 text-xs mt-1">
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

        {/* CASO A: No hay deudas en general (Base de datos limpia) */}
        {!loading && vencidos.length === 0 && (
            <div className="text-center mt-10 p-6 bg-gray-800 rounded-xl">
                <p className="text-4xl mb-2">✅</p>
                <p className="text-white font-bold">¡Sin deudas!</p>
                <p className="text-gray-400 text-sm">Todos los clientes están al día.</p>
            </div>
        )}

        {/* CASO B: Hay deudas, pero no coinciden con la búsqueda */}
        {!loading && vencidos.length > 0 && vencidosFiltrados.length === 0 && (
             <p className="text-center text-gray-500 mt-4">No se encontró a nadie con ese nombre.</p>
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