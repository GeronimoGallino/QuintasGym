import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import ModalConfirmacion from '../components/ModalConfirmacion'; 
import ModalExito from '../components/ModalExito'; // 1. IMPORTAMOS EL MODAL DE ÉXITO

const NuevoCliente = () => {
  const navigate = useNavigate();

  // 1. ESTADO DEL FORMULARIO
  const [datos, setDatos] = useState({
    nombre_completo: '', dni: '', telefono: '', direccion: '', 
    fecha_nacimiento: '', sexo: 'M', mail: ''
  });

  // 2. CONFIGURACIÓN DEL MODAL DE CONFIRMACIÓN (Decisión / Error / Reactivar)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    titulo: '',
    mensaje: '',
    textoConfirmar: '',
    colorBoton: '',
    accionConfirmar: () => {} 
  });

  // 3. NUEVO ESTADO PARA EL MODAL DE ÉXITO (Celebración)
  const [exitoConfig, setExitoConfig] = useState({
    show: false,
    mensaje: ''
  });

  // Manejar inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dni' || name === 'telefono') {
      setDatos({ ...datos, [name]: value.replace(/[^0-9]/g, '') });
    } else {
      setDatos({ ...datos, [name]: value });
    }
  };

  // ENVÍO Y LÓGICA DE DECISIÓN
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await clientesService.create(datos);

      if (respuesta.tipo === 'CREADO') {
        // CAMBIO AQUÍ: En lugar de alert, mostramos el modal de éxito
        setExitoConfig({
            show: true,
            mensaje: `¡${datos.nombre_completo} ha sido registrado correctamente!`
        });
      } 
      
      // CASO A: YA EXISTE Y ESTÁ ACTIVO
      else if (respuesta.tipo === 'YA_EXISTE_ACTIVO') {
        setModalConfig({
            isOpen: true,
            titulo: '¡Cliente Ya Existe!',
            mensaje: `El DNI ingresado ya pertenece a ${respuesta.cliente.nombre_completo} y está ACTIVO. ¿Quieres ver su ficha?`,
            textoConfirmar: 'Ir al Perfil',
            colorBoton: 'bg-blue-600',
            accionConfirmar: () => navigate(`/clientes/${respuesta.cliente.id}`)
        });
      } 
      
      // CASO B: ESTÁ INACTIVO
      else if (respuesta.tipo === 'YA_EXISTE_INACTIVO') {
        setModalConfig({
            isOpen: true,
            titulo: '¡Cliente Encontrado!',
            mensaje: `El DNI pertenece a ${respuesta.cliente.nombre_completo} (Inactivo). ¿Deseas reactivarlo con los datos nuevos?`,
            textoConfirmar: 'Sí, Reactivar', 
            colorBoton: 'bg-green-600',
            accionConfirmar: async () => {
                try {
                    await clientesService.reactivar(respuesta.cliente.id, datos);
                    
                    // CAMBIO AQUÍ TAMBIÉN: Usamos el modal de éxito al reactivar
                    setExitoConfig({
                        show: true,
                        mensaje: `¡${respuesta.cliente.nombre_completo} ha sido reactivado con éxito!`
                    });
                    
                } catch (err) {
                    alert("Error al reactivar.");
                }
            }
        });
      }

    } catch (error) {
      console.error(error);
      alert('Error al procesar la solicitud.');
    }
  };

  // Función para cerrar el modal de éxito y salir
  const cerrarExito = () => {
      setExitoConfig({ ...exitoConfig, show: false });
      navigate('/clientes');
  };

  return (
    <div className="p-4 flex flex-col gap-4 text-white pb-20">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/clientes')} className="bg-gray-700 p-2 rounded-full active:scale-95">⬅️</button>
        <h1 className="text-2xl font-bold text-blue-500">Nuevo Cliente</h1>
      </div>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
            <label className="block text-gray-400 text-sm mb-1 ml-1">Nombre Completo *</label>
            <input type="text" name="nombre_completo" required className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-lg" value={datos.nombre_completo} onChange={handleChange} />
        </div>
        <div>
            <label className="block text-gray-400 text-sm mb-1 ml-1">DNI (Solo números) *</label>
            <input type="tel" name="dni" required className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-lg" value={datos.dni} onChange={handleChange} maxLength={10} />
        </div>
        <div>
            <label className="block text-gray-400 text-sm mb-1 ml-1">Teléfono</label>
            <input type="tel" name="telefono" className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-lg" value={datos.telefono} onChange={handleChange} />
        </div>
        <div>
            <label className="block text-gray-400 text-sm mb-1 ml-1">Dirección</label>
            <input type="text" name="direccion" className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-lg" value={datos.direccion} onChange={handleChange} />
        </div>
        <div>
            <label className="block text-gray-400 text-sm mb-1 ml-1">Fecha de Nacimiento</label>
            <input type="date" name="fecha_nacimiento" className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-lg text-white" style={{ colorScheme: 'dark' }} value={datos.fecha_nacimiento} onChange={handleChange} />
        </div>
        <div>
            <label className="block text-gray-400 text-sm mb-1 ml-1">Sexo *</label>
            <select name="sexo" required className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-lg text-white" value={datos.sexo} onChange={handleChange}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
            </select>
        </div>
        <div>
            <label className="block text-gray-400 text-sm mb-1 ml-1">Email</label>
            <input type="email" name="mail" className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none text-lg" value={datos.mail} onChange={handleChange} />
        </div>

        <button type="submit" className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform active:scale-95 transition-all text-xl">
            GUARDAR CLIENTE
        </button>
      </form>

      {/* 1. MODAL DE CONFIRMACIÓN (Negro) */}
      <ModalConfirmacion 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={() => {
            modalConfig.accionConfirmar(); 
            setModalConfig({ ...modalConfig, isOpen: false });
        }}
        titulo={modalConfig.titulo}
        mensaje={modalConfig.mensaje}
        textoConfirmar={modalConfig.textoConfirmar}
        colorBoton={modalConfig.colorBoton}
      />

      {/* 2. MODAL DE ÉXITO (Verde y con Check) */}
      <ModalExito 
        isOpen={exitoConfig.show}
        onClose={cerrarExito} // Al cerrar (Click en "Genial"), nos vamos a la lista
        mensaje={exitoConfig.mensaje}
      />

    </div>
  );
};

export default NuevoCliente;