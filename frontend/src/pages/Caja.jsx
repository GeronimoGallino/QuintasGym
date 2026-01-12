import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import { pagosService } from '../services/pagos.service';
// 1. IMPORTAMOS EL COMPONENTE NUEVO
import ModalExito from '../components/ModalExito';

const Caja = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState(null);
  
  // Datos del Formulario
  const [monto, setMonto] = useState('');
  const [meses, setMeses] = useState(1);
  const [metodo, setMetodo] = useState('Efectivo');

  // 2. ESTADO PARA CONTROLAR EL MODAL DE ÉXITO
  const [showExito, setShowExito] = useState(false);

  // Cargamos cliente
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

  // Manejar el envío del pago
  const handlePagar = async (e) => {
    e.preventDefault();

    try {
      await pagosService.create({
        cliente_id: id,
        monto: parseFloat(monto),
        cantidad_meses: parseInt(meses),
        metodo_pago: metodo
      });
  
      // 3. AQUÍ EL CAMBIO: No navegamos todavía, mostramos el éxito
      setShowExito(true);

    } catch (error) {
      alert("Hubo un error al registrar el pago.");
    }
  };

  // 4. FUNCIÓN PARA CERRAR Y VOLVER AL INICIO
  const cerrarYSalir = () => {
      setShowExito(false);
      navigate('/'); // Ahora sí nos vamos al Dashboard
  };

  if (!cliente) return <div className="text-white text-center mt-10">Cargando caja...</div>;

  return (
    <div className="p-4 min-h-screen flex flex-col">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-gray-700 text-white p-2 rounded-full">⬅️</button>
        <h1 className="text-xl font-bold text-green-500">Registrar Cobro</h1>
      </div>

      {/* Info del Cliente */}
      <div className="bg-gray-800 p-4 rounded-xl mb-6 border border-gray-700 text-center">
        <p className="text-gray-400 text-sm">Cobrando a:</p>
        <h2 className="text-2xl font-bold text-white uppercase">{cliente.nombre_completo}</h2>
        <p className="text-xs text-gray-500 mt-1">DNI: {cliente.dni}</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handlePagar} className="flex flex-col gap-6">
        
        {/* Monto */}
        <div>
            <label className="text-white font-bold ml-1">Monto ($)</label>
            <input 
                type="number" 
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
                <input 
                    type="number" 
                    value={meses} 
                    onChange={(e) => setMeses(e.target.value)}
                    min="1"
                    className="w-full p-4 text-xl text-center rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
                />
            </div>
            <div className="w-1/2">
                <label className="text-gray-400 text-sm ml-1">Método</label>
                <select 
                    value={metodo} 
                    onChange={(e) => setMetodo(e.target.value)}
                    className="w-full p-4 h-[62px] text-center rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
                >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transf.</option>
                    <option value="Credito">Crédito</option>
                </select>
            </div>
        </div>

        {/* Botón Pagar */}
        <button 
            type="submit"
            className="mt-4 bg-green-600 text-white text-xl font-bold p-5 rounded-2xl shadow-lg active:scale-95 transition-transform"
        >
            CONFIRMAR PAGO 💸
        </button>

      </form>

      {/* 5. AGREGAMOS EL COMPONENTE AL FINAL */}
      <ModalExito 
        isOpen={showExito}
        onClose={cerrarYSalir} // Al cerrar, ejecuta la navegación
        mensaje={`Se cobraron $${monto} a ${cliente.nombre_completo}`}
      />

    </div>
  );
};

export default Caja;