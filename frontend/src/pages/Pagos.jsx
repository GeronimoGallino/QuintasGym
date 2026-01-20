import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pagosService } from '../services/pagos.service';
import { formatearFechaYHora } from '../utils/dateUtils';

// Importamos los componentes modales
import DetallePagoTicket from '../components/DetallePagoTicket';
import ModalConfirmacion from '../components/ModalConfirmacion';
import ModalError from '../components/ModalError';

const Pagos = () => {
  const navigate = useNavigate();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para controlar los modales
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [confirmacionEliminar, setConfirmacionEliminar] = useState(false);
  const [errorInfo, setErrorInfo] = useState({ show: false, message: '' });
  const [eliminando, setEliminando] = useState(false);

  
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const data = await pagosService.getAll();
      setPagos(data);
    } catch (error) {
      alert("No se pudo cargar el historial.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Abre el Ticket
  const abrirTicket = (pago) => {
    setTicketSeleccionado(pago);
  };

  // 2. Desde el Ticket, piden eliminar -> Cerramos ticket, abrimos confirmación
  const solicitarEliminacion = () => {
    // No borramos el ticketSeleccionado todavía, lo usamos para saber qué borrar
    setConfirmacionEliminar(true); 
  };

  // 3. Confirmaron borrado -> Ejecutamos
  const confirmarEliminacion = async () => {
      if (!ticketSeleccionado) return;

      if (eliminando) return; 
      setEliminando(true);

      try {
        await pagosService.delete(ticketSeleccionado.id);
        
        // Si sale bien:
        setPagos(pagos.filter(p => p.id !== ticketSeleccionado.id));
        setConfirmacionEliminar(false);
        setTicketSeleccionado(null);
        // Aquí podrías poner tu ModalExito si quisieras

      } catch (error) {
        // Si sale mal (ej: No es el último pago):
        setConfirmacionEliminar(false); // Cerramos la pregunta "¿Estás seguro?"
        
        // 3. Leemos el mensaje del Backend y abrimos el ModalError
        const mensajeBackend = error.response?.data?.message || "Error desconocido al eliminar.";
        
        setErrorInfo({ 
            show: true, 
            message: mensajeBackend 
        });
      }finally {
        // 3. LIBERAR BOTÓN (Importante por si falla)
        setEliminando(false); 
    }
    };

  

  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen max-w-2xl mx-auto w-full">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/')} className="bg-gray-700 text-white p-2 rounded-full active:scale-95 transition-all hover:bg-gray-600">⬅️</button>
        <h1 className="text-2xl font-bold text-orange-500">Últimos Pagos</h1>
      </div>

      <p className="text-gray-400 text-sm mb-2">
        Toca un pago para ver el detalle completo.
      </p>

      <div className="flex flex-col gap-3">
        {loading && <p className="text-center text-gray-500 mt-10 animate-pulse">Cargando caja...</p>}

        {!loading && pagos.map((pago) => {
            const { fecha, hora } = formatearFechaYHora(pago.fecha_pago);
            
            return (
                <div 
                    key={pago.id} 
                    onClick={() => abrirTicket(pago)}
                    className="bg-gray-800 p-4 rounded-xl border-l-4 border-orange-500 shadow-md flex justify-between items-center cursor-pointer hover:bg-gray-750 hover:scale-[1.01] transition-all duration-200 active:scale-95"
                >
                    {/* INFO IZQUIERDA */}
                    <div>
                        <h3 className="text-white font-bold text-lg capitalize">
                            {pago.Cliente ? pago.Cliente.nombre_completo : 'Cliente Eliminado'}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                            📅 {fecha} - 🕒 {hora} hs
                        </p>
                        <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded mt-1 inline-block">
                            {pago.metodo_pago}
                        </span>
                    </div>

                    {/* INFO DERECHA (RESTURADO: Muestra Dinero y Meses) */}
                    <div className="text-right flex flex-col items-end">
                        <span className="text-green-400 font-bold text-xl">
                            + ${pago.monto}
                        </span>
                        <span className="text-orange-200 text-xs font-medium">
                            {pago.cantidad_meses === 0 
                                ? '1 Día' 
                                : `${pago.cantidad_meses} ${pago.cantidad_meses === 1 ? 'Mes' : 'Meses'}`
                            }
                        </span>
                    </div>
                </div>
            );
        })}
      </div>

      {/* --- MODALES --- */}

      {/* 1. El Ticket */}
      {ticketSeleccionado && !confirmacionEliminar && (
        <DetallePagoTicket 
            pago={ticketSeleccionado}
            onClose={() => setTicketSeleccionado(null)}
            onSolicitarEliminacion={solicitarEliminacion}
        />
      )}

      {/* 2. La Confirmación de Borrado */}
      <ModalConfirmacion 
        isOpen={confirmacionEliminar}
        onClose={() => !eliminando && setConfirmacionEliminar(false)} // No dejar cerrar si está cargando
        onConfirm={confirmarEliminacion}
        titulo="¿Eliminar Pago?"
        mensaje={`Vas a eliminar el pago de $${ticketSeleccionado?.monto}. Esto afectará el total de la caja.`}
        textoConfirmar="Sí, Borrar"
        procesando={eliminando}
      />

      <ModalError 
        isOpen={errorInfo.show}
        onClose={() => setErrorInfo({ ...errorInfo, show: false })} // Al cerrar, limpiamos
        titulo="No se pudo eliminar"
        mensaje={errorInfo.message}
      />
    </div>
  );
};

export default Pagos;