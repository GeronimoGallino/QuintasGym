// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Reutilizamos tu componente visual UI
const FormInput = ({ label, ...props }) => (
  <div className="group">
    <label className="block text-gray-400 text-sm font-medium mb-2 ml-1 transition-colors group-focus-within:text-orange-400">
      {label}
    </label>
    <input 
      className="w-full bg-gray-800 text-white text-lg placeholder-gray-600 py-3 px-4 rounded-xl border border-gray-700 transition-all duration-200 ease-in-out focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 focus:bg-gray-800/80 shadow-sm"
      {...props} 
    />
  </div>
);

const Login = () => {
  const [credenciales, setCredenciales] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth(); // Usamos el contexto
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(credenciales.username, credenciales.password);
      navigate('/'); // Redirigir al Dashboard si sale bien
  } catch (err) {
    // CAMBIO: Intentamos leer el mensaje específico del backend primero
    const mensajeError = err.response?.data?.message || err.message || 'Error desconocido';
    
    setError(mensajeError);
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl">
        
        {/* LOGO / TÍTULO */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 mb-2">
            QuintasGym
          </h1>
          <p className="text-gray-400 text-sm">Panel de Gestión</p>
        </div>

        {/* MENSAJE DE ERROR */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormInput 
            label="Usuario" 
            name="username" 
            type="text" 
            placeholder="Ej: admin"
            value={credenciales.username}
            onChange={handleChange}
            required
          />

          <FormInput 
            label="Contraseña" 
            name="password" 
            type="password" 
            placeholder="••••••"
            value={credenciales.password}
            onChange={handleChange}
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold text-lg tracking-wide py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] transform active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Ingresando...' : 'ENTRAR AL SISTEMA'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;