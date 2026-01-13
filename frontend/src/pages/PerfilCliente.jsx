import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import ModalConfirmacion from '../components/ModalConfirmacion';
import { formatearFecha } from '../utils/dateUtils';
const PerfilCliente = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); // Usamos este único navigate para todo
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const data = await clientesService.getById(id);
        setCliente(data);
      } catch (error) {
        alert("No se pudo cargar el cliente");
        navigate('/clientes'); 
      } finally {
        setLoading(false);
      }
    };
    cargarCliente();
  }, [id]);


const pedirConfirmacion = () => {
    setShowModal(true);
  };

  // 4. FUNCIÓN B: Ejecuta el borrado real (Se llama al dar "Sí" en el modal)
  const confirmarBorrado = async () => {
    try {
      await clientesService.delete(cliente.id);
      setShowModal(false); // Cerramos el modal
      navigate('/clientes'); // Nos vamos
    } catch (error) {
      alert("Error al eliminar");
      setShowModal(false);
    }
  };
  // ------------------------------------
  if (loading) return <div className="text-white text-center mt-10">Cargando Carnet...</div>;
  if (!cliente) return null;

  return (
    <div className="p-4 flex flex-col min-h-screen relative">
      
      {/* Header con botón Volver */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-700 text-white p-2 rounded-full active:scale-95"
        >
          ⬅️
        </button>
        <h1 className="text-xl font-bold text-white">Perfil de Cliente</h1>
      </div>

      {/* TARJETA / CARNET PRINCIPAL */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center mb-8 border border-gray-700">
        
        {/* Foto de Perfil (Placeholder) */}
        <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
          👤
        </div>

        {/* Nombre */}
        <h2 className="text-2xl font-bold text-white text-center mb-1 uppercase">
          {cliente.nombre_completo}
        </h2>
        
        {/* Estado (Badge) */}
        <span className={`px-4 py-1 rounded-full text-sm font-bold mb-6 ${
             cliente.activo ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
            {cliente.activo ? "ACTIVO" : "INACTIVO"}
        </span>

        {/* LISTA COMPLETA DE DATOS */}
        <div className="w-full space-y-4 text-sm">
            
            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">DNI:</span>
                <span className="text-white font-mono">{cliente.dni}</span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-mono text-right max-w-[60%] break-words">
                    {cliente.mail || '---'}
                </span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Teléfono:</span>
                <span className="text-white font-mono">{cliente.telefono || '---'}</span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Dirección:</span>
                <span className="text-white font-mono text-right">{cliente.direccion || '---'}</span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Sexo:</span>
                <span className="text-white font-mono">{cliente.sexo || '---'}</span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Fecha Nacimiento:</span>
                <span className="text-white font-mono">
                    {formatearFecha(cliente.fecha_nacimiento)}
                </span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Vencimiento Cuota:</span>
                <span className={`${cliente.fecha_vencimiento ? 'text-white' : 'text-gray-500'} font-mono`}>
                    {cliente.fecha_vencimiento ? formatearFecha(cliente.fecha_vencimiento) : 'Sin vencimiento'}
                </span>
            </div>

        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex flex-col gap-3 mt-auto mb-6">
        <button 
            onClick={() => navigate(`/clientes/editar/${cliente.id}`)} 
            className="bg-blue-600 text-white p-4 rounded-xl font-bold active:scale-95 shadow-lg"
        >
           ✏️ Editar Datos
        </button>
        
        <button 
            onClick={() => navigate(`/clientes/${id}/historial`)} 
            className="bg-gray-700 text-white p-4 rounded-xl font-bold active:scale-95 shadow-lg"
        >
           📄 Ver Historial
        </button>

        {/* BOTÓN ELIMINAR */}
        <button 
            className="bg-red-600 text-white p-4 rounded-xl font-bold mt-2"
            onClick={pedirConfirmacion} 
        >
           🗑️ Eliminar Cliente
        </button>
      </div>
      {/* 6. AQUI RENDERIZAMOS EL MODAL (Invisible hasta que showModal sea true) */}
      <ModalConfirmacion 
        isOpen={showModal}
        onClose={() => setShowModal(false)} // Si cancela, solo lo ocultamos
        onConfirm={confirmarBorrado}        // Si acepta, ejecutamos la lógica
        titulo="¿Dar de baja?"
        mensaje={`Estás a punto de desactivar a ${cliente.nombre_completo}. Podrás reactivarlo en el futuro.`}
      />

    </div>
  );
};

export default PerfilCliente;