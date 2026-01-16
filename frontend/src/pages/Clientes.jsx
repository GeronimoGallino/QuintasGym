import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importamos nuestras nuevas herramientas
import { clientesService } from '../services/clientes.service'; // Lógica de datos
import ClienteCard from '../components/ClienteCard'; // Lógica visual

const Clientes = () => {
  const navigate = useNavigate();
  
  // ESTADOS
  const [busqueda, setBusqueda] = useState(""); 
  const [clientes, setClientes] = useState([]); 
  const [loading, setLoading] = useState(true); // Agregamos estado de carga

  // useEffect limpio: Solo llama al servicio
  useEffect(() => { 
    const cargarDatos = async () => {
      try {
        const data = await clientesService.getAll(); // Usamos el servicio
        setClientes(data);
      } catch (error) {
        alert("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

 
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-4 max-w-2xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/')} className="bg-gray-700 text-white p-2 rounded-full">⬅️</button>
        <h1 className="text-2xl font-bold text-blue-500">Clientes</h1>
      </div>

      {/* Buscador */}
      <div className="relative">
        <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            className="w-full p-4 pl-12 rounded-xl bg-gray-800 text-white border border-gray-700"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />
        <span className="absolute left-4 top-4 text-gray-400">🔍</span>
      </div>

      {/* Lista de Clientes - AHORA USAMOS EL COMPONENTE */}
      <div className="flex flex-col gap-2">
        
        {loading && <p className="text-center text-gray-400">Cargando...</p>}

        {!loading && clientesFiltrados.map((cliente) => (
            // Renderizamos la "Tarjeta" importada
            <ClienteCard 
                key={cliente.id} 
                cliente={cliente} 
                onClick={() => navigate(`/clientes/${cliente.id}`)}
            />
        ))}

        {!loading && clientesFiltrados.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No se encontraron clientes.</p>
        )}
      </div>

      {/* Botón Flotante */}
      <button 
        onClick={() => navigate('/clientes/nuevo')}
        className="fixed bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-xl text-white"
      >
        +
      </button>

    </div>
  );
};

export default Clientes;