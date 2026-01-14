import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';

const Cobrar = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargamos clientes al inicio
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await clientesService.getAll();
        setClientes(data);
      } catch (error) {
        alert("Error cargando lista");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const filtrados = clientes.filter(c => 
    c.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen max-w-2xl mx-auto w-full">
      
      {/* Header VERDE */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/')} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <h1 className="text-2xl font-bold text-green-500">Seleccionar Cliente</h1>
      </div>

      {/* Buscador */}
      <input 
          type="text" 
          placeholder="Buscar cliente a cobrar..." 
          className="w-full p-4 rounded-xl bg-gray-800 text-white border border-green-900 focus:border-green-500 outline-none"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* Lista para Cobrar */}
      <div className="flex flex-col gap-2">
        {filtrados.map((cliente) => (
            <button 
                key={cliente.id}
                // AQUÍ LA DIFERENCIA: Vamos a la ruta /cobrar/ID
                onClick={() => navigate(`/cobrar/${cliente.id}`)}
                className="bg-gray-800 p-4 rounded-xl flex justify-between items-center active:bg-green-900 transition-colors border-l-4 border-green-600 shadow-md"
            >
                <span className="font-bold text-white">{cliente.nombre_completo}</span>
                <span className="text-green-400 text-2xl font-bold">➜</span>
            </button>
        ))}
      </div>
    </div>
  );
};

export default Cobrar;