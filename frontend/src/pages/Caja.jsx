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
  
  // 1. NUEVOS ESTADOS PARA FECHA MANUAL
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD para el input por defecto
  const hoyISO = new Date().toISOString().split('T')[0];
  const [mostrarInputFecha, setMostrarInputFecha] = useState(false);
  const [fechaPersonalizada, setFechaPersonalizada] = useState(hoyISO);

  // Estado para el Modal
  const [showExito, setShowExito] = useState(false);

  // Estado de carga (Anti doble click)
  const [enviando, setEnviando] = useState(false);

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

  // Función de filtrado (No letras en PC)
  const handleMontoChange = (e) => {
    const valor = e.target.value;
    if (valor === '' || /^[0-9]*\.?[0-9]*$/.test(valor)) {
      setMonto(valor);
    }
  };

  const handlePagar = async (e) => {
    e.preventDefault();

    if (enviando) return;
    setEnviando(true); 

    try {
      // Preparamos el payload
      const datosPago = {
        cliente_id: id,
        monto: parseFloat(monto),
        cantidad_meses: parseInt(meses),
        metodo_pago: metodo,
        // Si el usuario abrió el input, mandamos la fecha. Si no, mandamos null.
        fecha_inicio_personalizada: mostrarInputFecha ? fechaPersonalizada : null
      };

      await pagosService.create(datosPago);
  
      setShowExito(true);

    } catch (error) {
      alert("Hubo un error al registrar el pago.");
      setEnviando(false); 
    }
  };

  const cerrarYSalir = () => {
      setShowExito(false);
      navigate('/'); 
  };

  const esValido = monto && parseFloat(monto) > 0 && !enviando;

  if (!cliente) return <div className="text-white text-center mt-10">Cargando caja...</div>;

  return (
    <div className="p-4 min-h-screen flex flex-col w-full max-w-2xl mx-auto ">
      
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
                onChange={handleMontoChange} 
                placeholder="0.00"
                required
                className="w-full p-4 text-3xl font-bold text-center rounded-xl bg-gray-800 text-green-400 border border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
                disabled={enviando} 
            />
        </div>

        {/* Meses y Método */}
        <div className="flex gap-4">
            <div className="w-1/2">
                <label className="text-gray-400 text-sm ml-1">Duración</label>
                <select 
                    value={meses} 
                    onChange={(e) => setMeses(e.target.value)}
                    disabled={enviando}
                    className="w-full p-4 h-[62px] text-center rounded-xl bg-gray-800 text-white border border-gray-700 outline-none appearance-none"
                >
                    {/* CAMBIO 1: OPCIÓN PASE DIARIO */}
                    <option value="0">🎫 Pase Diario</option>
                    <option value="1">1 Mes</option>
                    <option value="2">2 Meses</option>
                    <option value="3">3 Meses</option>
                    <option value="4">4 Meses</option>
                    <option value="5">5 Meses</option>
                    <option value="6">6 Meses</option>
                    <option value="12">1 Año</option>
                </select>

            </div>
            <div className="w-1/2">
                <label className="text-gray-400 text-sm ml-1">Método</label>
                <select 
                    value={metodo} 
                    onChange={(e) => setMetodo(e.target.value)}
                    disabled={enviando}
                    className="w-full p-4 h-[62px] text-center rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
                >
                    <option value="Efectivo">Efectivo/Transferencia/QR</option>
                    <option value="Credito">Crédito</option>
                </select>
            </div>
        </div>

        {/* CAMBIO 2: LÓGICA DE FECHA MANUAL (Sin checkbox redundante) */}
        <div className="flex flex-col items-center justify-center pt-2 pb-4">
            {!mostrarInputFecha ? (
                // VISTA POR DEFECTO: Botón discreto
                <button 
                    type="button" // Importante para que no envíe el form
                    onClick={() => setMostrarInputFecha(true)}
                    className="text-blue-400 text-sm underline hover:text-blue-300 transition-colors"
                >
                    📅 Cambiar fecha de inicio
                </button>
            ) : (
                // VISTA DE EDICIÓN: Input Date
                <div className="w-full bg-gray-800 p-4 rounded-xl border border-blue-500/50 animation-fade-in">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-blue-300 text-sm font-bold">Iniciar cobertura el:</label>
                        <button 
                            type="button"
                            onClick={() => setMostrarInputFecha(false)}
                            className="text-gray-500 text-xs hover:text-white"
                        >
                            ✕ Cancelar
                        </button>
                    </div>
                    <input 
                        type="date"
                        value={fechaPersonalizada}
                        onChange={(e) => setFechaPersonalizada(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        ⚠️ Se ignorarán vencimientos anteriores.
                    </p>
                </div>
            )}
        </div>

        {/* Botón Pagar */}
        <button 
            type="submit"
            disabled={!esValido || enviando} 
            className={`text-white text-xl font-bold p-5 rounded-2xl shadow-lg transition-all ${
                esValido && !enviando
                ? 'bg-green-600 active:scale-95 hover:bg-green-500' 
                : 'bg-gray-600 opacity-50 cursor-not-allowed'
            }`}
        >
            {enviando ? 'PROCESANDO...' : 'CONFIRMAR PAGO 💸'}
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