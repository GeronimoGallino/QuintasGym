import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pagosService } from '../services/pagos.service';
import { clientesService } from '../services/clientes.service';
import { formatearFechaYHora } from '../utils/dateUtils';

// Importamos los componentes compartidos
import DetallePagoTicket from '../components/DetallePagoTicket';
import ModalConfirmacion from '../components/ModalConfirmacion';

const HistorialCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [pagos, setPagos] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para modales
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataCliente = await clientesService.getById(id);
        setCliente(dataCliente);

        const dataPagos = await pagosService.getHistorialCliente(id);
        setPagos(dataPagos);
        
      } catch (error) {
        alert("Error cargando historial.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id, navigate]);

  // Lógica de borrado idéntica a Pagos.jsx
  const abrirTicket = (pago) => {
    // Al historial específico a veces le falta el objeto Cliente completo dentro del pago, 
    // así que se lo inyectamos manualmente para que el Ticket se vea lindo
    const pagoCompleto = { ...pago, Cliente: cliente };
    setTicketSeleccionado(pagoCompleto);
  };

  const solicitarEliminacion = () => {
    setConfirmacionEliminar(true);
  };

  const confirmarEliminacion = async () => {
    if (!ticketSeleccionado) return;
    if (eliminando) return; 
    setEliminando(true);

    try {
      await pagosService.delete(ticketSeleccionado.id);
      setPagos(pagos.filter(p => p.id !== ticketSeleccionado.id));
      setConfirmacionEliminar(false);
      setTicketSeleccionado(null);
    } catch (error) {
      setConfirmacionEliminar(false);
       alert(error.response?.data?.message || "Error al eliminar");
    }finally {
       setEliminando(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen max-w-2xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate(-1)} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <div>
            <h1 className="text-xl font-bold text-white">Historial de Pagos</h1>
            {cliente && <p className="text-sm text-gray-400">{cliente.nombre_completo}</p>}
        </div>
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-3">
        {loading && <p className="text-center text-gray-500 mt-10">Buscando comprobantes...</p>}

        {!loading && pagos.map((pago) => {
            const { fecha, hora } = formatearFechaYHora(pago.fecha_pago);
            
            return (
                <div 
                    key={pago.id} 
                    onClick={() => abrirTicket(pago)} // <--- CLIC PARA ABRIR
                    className="bg-gray-800 p-4 rounded-xl border-l-4 border-blue-500 shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-750 hover:scale-[1.01] transition-all active:scale-95"
                >
                    {/* IZQUIERDA */}
                    <div>
                        <p className="text-white font-bold text-lg">📅 {fecha}</p>
                        <p className="text-gray-400 text-xs mt-1">Hora: {hora} hs</p>
                        <span className="text-[10px] text-gray-300 bg-gray-700 px-2 py-0.5 rounded mt-1 inline-block uppercase tracking-wide">
                            {pago.metodo_pago}
                        </span>
                    </div>

                    {/* DERECHA */}
                    <div className="text-right flex flex-col items-end">
                        <span className="text-green-400 font-bold text-xl">
                            ${pago.monto}
                        </span>
                        <span className="text-blue-200 text-xs font-medium">
                              {pago.cantidad_meses === 0 
                                ? '1 Día' 
                                : `${pago.cantidad_meses} ${pago.cantidad_meses === 1 ? 'Mes' : 'Meses'}`
                              }
                        </span>
                    </div>
                </div>
            );
        })}

        {!loading && pagos.length === 0 && (
            <div className="text-center mt-10 p-6 bg-gray-800 rounded-xl opacity-70">
                <p className="text-4xl mb-2">🤷‍♂️</p>
                <p className="text-white font-bold">Sin registros</p>
                <p className="text-gray-400 text-sm">Este cliente nunca ha pagado.</p>
            </div>
        )}
      </div>

      {/* --- MODALES --- */}
      {ticketSeleccionado && !confirmacionEliminar && (
        <DetallePagoTicket 
            pago={ticketSeleccionado}
            onClose={() => setTicketSeleccionado(null)}
            onSolicitarEliminacion={solicitarEliminacion}
        />
      )}

      <ModalConfirmacion 
        isOpen={confirmacionEliminar}
        onClose={() => !eliminando && setConfirmacionEliminar(false)}
        onConfirm={confirmarEliminacion}
        titulo="¿Eliminar Pago?"
        mensaje={`Se eliminará el registro de $${ticketSeleccionado?.monto} del historial de ${cliente?.nombre_completo}.`}
        textoConfirmar="Sí, Eliminar"
        procesando={eliminando}
      />

    </div>
  );
};

export default HistorialCliente;