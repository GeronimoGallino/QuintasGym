import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import ModalConfirmacion from '../components/ModalConfirmacion'; 
import ModalExito from '../components/ModalExito'; 

// 1. UI COMPONENT: INPUT PRO
const FormInput = ({ label, ...props }) => (
  <div className="group">
    <label className="block text-gray-400 text-sm font-medium mb-2 ml-1 transition-colors group-focus-within:text-blue-400">
      {label}
    </label>
    <input 
      className="w-full bg-gray-800 text-white text-lg placeholder-gray-500 py-3 px-4 rounded-xl border border-gray-700 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-gray-800/80 shadow-sm"
      {...props} 
    />
  </div>
);

// 2. UI COMPONENT: SELECT PRO (Para que coincida con el Input)
const FormSelect = ({ label, children, ...props }) => (
  <div className="group">
    <label className="block text-gray-400 text-sm font-medium mb-2 ml-1 transition-colors group-focus-within:text-blue-400">
      {label}
    </label>
    <div className="relative">
        <select 
            className="w-full bg-gray-800 text-white text-lg py-3 px-4 rounded-xl border border-gray-700 transition-all duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 appearance-none cursor-pointer"
            {...props}
        >
            {children}
        </select>
        {/* Icono de flecha custom para reemplazar el nativo feo */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
  </div>
);

const NuevoCliente = () => {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    nombre_completo: '', dni: '', telefono: '', direccion: '', 
    fecha_nacimiento: '', sexo: 'M', mail: ''
  });

  const [modalConflict, setModalConflict] = useState({ isOpen: false, data: null, type: null });
  const [modalSuccess, setModalSuccess] = useState({ isOpen: false, message: '', idCliente: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumericField = ['dni', 'telefono'].includes(name);
    const finalValue = isNumericField ? value.replace(/[^0-9]/g, '') : value;
    setDatos(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await clientesService.create(datos);
      procesarRespuesta(respuesta);
    } catch (error) {
      console.error(error);
      alert('Error de conexión.');
    }
  };

  const procesarRespuesta = (res) => {
    switch (res.tipo) {
      case 'CREADO':
        setModalSuccess({ isOpen: true, message: `¡${datos.nombre_completo} registrado!`, idCliente: res.cliente.id });
        break;
      case 'YA_EXISTE_ACTIVO':
        setModalConflict({ isOpen: true, type: 'ACTIVO', data: res.cliente });
        break;
      case 'YA_EXISTE_INACTIVO':
        setModalConflict({ isOpen: true, type: 'INACTIVO', data: res.cliente });
        break;
      default: alert('Error desconocido');
    }
  };

  const handleReactivar = async () => {
    try {
      await clientesService.reactivar(modalConflict.data.id, datos);
      setModalConflict({ isOpen: false, data: null, type: null });
      setModalSuccess({ isOpen: true, message: `¡Reactivado con éxito!`, idCliente: null });
    } catch (error) { alert("Error al reactivar."); }
  };

  return (
    // CONTENEDOR CENTRALIZADO
    <div className="p-6 flex flex-col gap-6 text-white pb-20 max-w-2xl mx-auto w-full">
      
      {/* Header con botón atrás más sutil */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate('/clientes')} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-full active:scale-95 transition-all">
            ⬅️
        </button>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Nuevo Cliente
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <FormInput 
          label="Nombre Completo *" name="nombre_completo" required placeholder="Ej: Lionel Messi"
          value={datos.nombre_completo} onChange={handleChange} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput 
              label="DNI *" name="dni" type="tel" required maxLength={10} placeholder="Sin puntos"
              value={datos.dni} onChange={handleChange} 
            />
            <FormSelect 
                label="Sexo *" name="sexo" required 
                value={datos.sexo} onChange={handleChange}
            >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
            </FormSelect>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput 
              label="Teléfono" name="telefono" type="tel" placeholder="Opcional"
              value={datos.telefono} onChange={handleChange} 
            />
             <FormInput 
              label="Email" name="mail" type="email" placeholder="cliente@email.com"
              value={datos.mail} onChange={handleChange} 
            />
        </div>

        <FormInput 
          label="Dirección" name="direccion" placeholder="Calle, Altura, Barrio"
          value={datos.direccion} onChange={handleChange} 
        />

        <FormInput 
          label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" 
          style={{ colorScheme: 'dark' }}
          value={datos.fecha_nacimiento} onChange={handleChange} 
        />

        {/* BOTÓN CON ESTILO GLOW */}
        <button 
          type="submit" 
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-lg tracking-wide py-4 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transform active:scale-[0.98] transition-all duration-200"
        >
          GUARDAR CLIENTE
        </button>
      </form>

      {/* MODALES (Sin cambios lógicos, solo visualización) */}
      <ModalConfirmacion 
        isOpen={modalConflict.isOpen}
        onClose={() => setModalConflict({ ...modalConflict, isOpen: false })}
        onConfirm={modalConflict.type === 'INACTIVO' ? handleReactivar : () => navigate(`/clientes/${modalConflict.data.id}`)}
        titulo={modalConflict.type === 'INACTIVO' ? '¡Cliente Encontrado!' : '¡Cliente Ya Existe!'}
        mensaje={modalConflict.type === 'INACTIVO' 
            ? `El DNI pertenece a ${modalConflict.data?.nombre_completo} (Inactivo). ¿Deseas reactivarlo?`
            : `El DNI ya pertenece a ${modalConflict.data?.nombre_completo} y está ACTIVO. ¿Quieres ver su ficha?`
        }
        textoConfirmar={modalConflict.type === 'INACTIVO' ? 'Sí, Reactivar' : 'Ir al Perfil'}
        colorBoton={modalConflict.type === 'INACTIVO' ? 'bg-green-600' : 'bg-blue-600'}
      />

      <ModalExito 
        isOpen={modalSuccess.isOpen}
        onClose={() => navigate('/clientes')} 
        mensaje={modalSuccess.message}
        onAccion={modalSuccess.idCliente ? () => navigate(`/cobrar/${modalSuccess.idCliente}`) : null}
        textoAccion="💸 Cobrar 1º Cuota"
      />

    </div>
  );
};

export default NuevoCliente;