import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import { pagosService } from '../services/pagos.service';
import ModalExito from '../components/ModalExito';

const Caja = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState(null);
  
  // Datos del Formulario
  const [monto, setMonto] = useState('');
  const [meses, setMeses] = useState(1);
  const [metodo, setMetodo] = useState('Efectivo');
  
  // 1. NUEVO ESTADO PARA REINICIAR CICLO
  const [reiniciarCiclo, setReiniciarCiclo] = useState(false);

  // Estado para el Modal
  const [showExito, setShowExito] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const data = await clientesService.getById(id);
        setCliente(data);
      } catch (error) {
        alert("Error cargando cliente");
        navigate('/cobrar');
      }
    };
    cargarCliente();
  }, [id]);

  const handlePagar = async (e) => {
    e.preventDefault();

    try {
      await pagosService.create({
        cliente_id: id,
        monto: parseFloat(monto),
        cantidad_meses: parseInt(meses),
        metodo_pago: metodo,
        reiniciar_ciclo: reiniciarCiclo // <--- 2. ENVIAMOS LA OPCIÓN AL BACKEND
      });
  
      setShowExito(true);

    } catch (error) {
      alert("Hubo un error al registrar el pago.");
    }
  };

  const cerrarYSalir = () => {
      setShowExito(false);
      navigate('/'); 
  };

  // Validar botón
  const esValido = monto && parseFloat(monto) > 0;

  if (!cliente) return <div className="text-white text-center mt-10">Cargando caja...</div>;

  return (
    <div className="p-4 min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <h1 className="text-xl font-bold text-green-500">Registrar Cobro</h1>
      </div>

      {/* Info del Cliente */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700 text-center">
        <p className="text-gray-400 text-sm">Cobrando a:</p>
        <h2 className="text-2xl font-bold text-white uppercase">{cliente.nombre_completo}</h2>
        <p className="text-xs text-gray-500 mt-1">DNI: {cliente.dni}</p>
      </div>

      <form onSubmit={handlePagar} className="flex flex-col gap-6">
        
        {/* Monto */}
        <div>
            <label className="text-white font-bold ml-1">Monto ($)</label>
            <input 
                type="tel" 
                value={monto} 
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                required
                min="1"
                className="w-full p-4 text-3xl font-bold text-center rounded-xl bg-gray-800 text-green-400 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
            />
        </div>

        {/* Meses y Método */}
        <div className="flex gap-4">
            <div className="w-1/2">
                <label className="text-gray-400 text-sm ml-1">Meses</label>
                
                {/* CAMBIO: Usamos SELECT en lugar de INPUT */}
                <select 
                    value={meses} 
                    onChange={(e) => setMeses(e.target.value)}
                    className="w-full p-4 h-[62px] text-center rounded-xl bg-gray-800 text-white border border-gray-700 outline-none appearance-none"
                >
                    <option value="1">1 Mes</option>
                    <option value="2">2 Meses</option>
                    <option value="3">3 Meses</option>
                    <option value="4">4 Meses</option>
                    <option value="5">5 Meses</option>
                    <option value="6">6 Meses</option>
                    <option value="7">7 Meses</option>
                    <option value="8">8 Meses</option>
                    <option value="9">9 Meses</option>
                    <option value="10">10 Meses</option>
                    <option value="11">11 Meses</option>
                    <option value="12">1 Año</option>
                </select>

            </div>
            <div className="w-1/2">
                <label className="text-gray-400 text-sm ml-1">Método</label>
                <select 
                    value={metodo} 
                    onChange={(e) => setMetodo(e.target.value)}
                    className="w-full p-4 h-[62px] text-center rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
                >
                    <option value="Efectivo">Efectivo/Transf/Qr</option>
                    <option value="Credito">Crédito</option>
                </select>
            </div>
        </div>
        {/* 3. CHECKBOX PARA REINICIAR CICLO */}
        <div 
            onClick={() => setReiniciarCiclo(!reiniciarCiclo)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                reiniciarCiclo 
                ? 'bg-blue-900/30 border-blue-500' 
                : 'bg-gray-800 border-gray-700'
            }`}
        >
            {/* Casilla Visual */}
            <div className={`w-6 h-6 rounded border flex items-center justify-center ${
                reiniciarCiclo ? 'bg-blue-500 border-blue-500' : 'border-gray-500'
            }`}>
                {reiniciarCiclo && <span className="text-white font-bold text-sm">✓</span>}
            </div>

            {/* Texto Explicativo */}
            <div className="flex flex-col">
                <span className={`font-bold ${reiniciarCiclo ? 'text-blue-300' : 'text-gray-300'}`}>
                    Reiniciar desde Hoy
                </span>
                <span className="text-xs text-gray-500">
                    Úsalo si el cliente vuelve tras una ausencia larga.
                </span>
            </div>
        </div>

        {/* Botón Pagar (Con validación visual) */}
        <button 
            type="submit"
            disabled={!esValido}
            className={`mt-2 text-white text-xl font-bold p-5 rounded-2xl shadow-lg transition-all ${
                esValido 
                ? 'bg-green-600 active:scale-95 hover:bg-green-500' 
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
        >
            CONFIRMAR PAGO 💸
        </button>

      </form>

      <ModalExito 
        isOpen={showExito}
        onClose={cerrarYSalir} 
        mensaje={`Se cobraron $${monto} a ${cliente.nombre_completo}`}
      />

    </div>
  );
};

export default Caja;