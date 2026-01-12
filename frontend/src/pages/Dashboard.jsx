import React, { useState, useEffect } from 'react'; // 1. Importamos Hooks
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service'; // 2. Importamos el servicio

const Dashboard = () => {
  const navigate = useNavigate();
  
  // 3. Estado para guardar el numerito
  const [cantidadVencidos, setCantidadVencidos] = useState(0);

  // 4. useEffect para pedir los datos al cargar la pantalla
  useEffect(() => {
    const obtenerContador = async () => {
      try {
        // Usamos la misma función que ya creamos. 
        // Trae toda la lista, pero aquí solo nos importa cuántos son (.length)
        const lista = await clientesService.getVencidos();
        setCantidadVencidos(lista.length);
      } catch (error) {
        console.error("Error contando vencidos:", error);
      }
    };

    obtenerContador();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-orange-500">QuintasGym</h1>
          <p className="text-sm text-gray-400">Panel de Control</p>
        </div>
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
          <span>👤</span>
        </div>
      </header>

      {/* --- BOTÓN ROJO: VENCIMIENTOS --- */}
      <button 
        onClick={() => navigate('/vencidos')}
        className="relative w-full bg-red-600 p-6 rounded-2xl shadow-lg text-left flex justify-between items-center active:scale-95 transition-transform"
      >
        <div>
           <h2 className="text-2xl font-bold text-white">Vencimientos</h2>
           <p className="text-red-200 text-sm">Gestionar accesos</p>
        </div>
        
        {/* El Globo de Notificación (Badge) */}
        {/* Solo mostramos el globo si hay más de 0 vencidos. Si es 0, no molesta visualmente. */}
        {cantidadVencidos > 0 && (
            <div className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cantidadVencidos}
            </div>
        )}

        {/* Si quieres mostrar el "0" en vez de ocultarlo, borra la línea de arriba y usa esta:
        <div className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center font-bold shadow-sm">
             {cantidadVencidos}
        </div> 
        */}

      </button>

      {/* --- BOTÓN VERDE: COBRAR --- */}
      <button 
        onClick={() => navigate('/cobrar')}
        className="w-full bg-green-600 p-6 rounded-2xl shadow-lg text-left flex justify-between items-center active:scale-95 transition-transform"
      >
        <div>
           <h2 className="text-2xl font-bold text-white">Cobrar</h2>
           <p className="text-green-200 text-sm">Registrar pago</p>
        </div>
        <div className="text-4xl">💸</div>
      </button>

      {/* --- BOTÓN AZUL: CLIENTES --- */}
      <button 
        onClick={() => navigate('/clientes')}
        className="w-full bg-blue-600 p-6 rounded-2xl shadow-lg text-left flex justify-between items-center active:scale-95 transition-transform"
      >
        <div>
           <h2 className="text-2xl font-bold text-white">Clientes</h2>
           <p className="text-blue-200 text-sm">Ver padrón completo</p>
        </div>
        <div className="text-4xl">👥</div>
      </button>

      {/* --- BOTÓN NARANJA: PAGOS --- */}
      <button 
        onClick={() => navigate('/pagos')}
        className="w-full bg-orange-600 p-6 rounded-2xl shadow-lg text-left flex justify-between items-center active:scale-95 transition-transform"
      >
        <div>
           <h2 className="text-2xl font-bold text-white">Historial</h2>
           <p className="text-orange-200 text-sm">Últimos movimientos</p>
        </div>
        <div className="text-4xl">📄</div>
      </button>

    </div>
  );
};

export default Dashboard;