import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import { useAuth } from '../context/AuthContext'; // <--- 1. IMPORTANTE: Importar el contexto

const Dashboard = () => {
  const navigate = useNavigate();
  
  // 2. Traemos user y logout del contexto
  const { user, logout } = useAuth(); 
  
  const [cantidadVencidos, setCantidadVencidos] = useState(0);

  // 3. Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Borra el token
    navigate('/login'); // Redirige al login
  };

  useEffect(() => {
    const obtenerContador = async () => {
      try {
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
      
      {/* --- HEADER MEJORADO --- */}
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold text-orange-500">QuintasGym</h1>
            <p className="text-sm text-gray-400">Panel de Control</p>
        </div>

        {/* BOTÓN DE LOGOUT */}
        <button 
          onClick={handleLogout}
          className="w-10 h-10 bg-gray-700 hover:bg-red-900/50 hover:text-red-400 hover:border-red-500/50 border border-gray-600 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md"
          title="Cerrar Sesión"
        >
          {/* Ícono de Puerta / Salir */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </button>
      </header>

      {/* --- BOTÓN ROJO: VENCIMIENTOS --- */}
      <button 
        onClick={() => navigate('/vencidos')}
        className="relative w-full bg-red-600 p-6 rounded-2xl shadow-lg text-left flex justify-between items-center active:scale-95 transition-transform group"
      >
        <div>
           <h2 className="text-2xl font-bold text-white">Vencimientos</h2>
           <p className="text-red-200 text-sm">Gestionar accesos</p>
        </div>

        {/* Badge contador */}
        <div className="w-10 h-10 bg-white text-red-600 rounded-full flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
             {cantidadVencidos}
        </div> 
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