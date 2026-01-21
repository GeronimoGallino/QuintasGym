import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import ModalExito from '../components/ModalExito';
import ModalConfirmacion from '../components/ModalConfirmacion'; 

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

// 2. UI COMPONENT: SELECT PRO
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
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
    </div>
  </div>
);

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // NUEVO ESTADO: CARGA AL GUARDAR
  const [enviando, setEnviando] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre_completo: '', dni: '', telefono: '', mail: '', 
    direccion: '', sexo: '', fecha_nacimiento: ''
  });

  // Estados para modales
  const [showExito, setShowExito] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false, titulo: '', mensaje: '', textoConfirmar: '', 
    colorBoton: '', accionConfirmar: () => {} 
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await clientesService.getById(id);
        
        let fechaFormat = '';
        if (data.fecha_nacimiento) {
            fechaFormat = new Date(data.fecha_nacimiento).toISOString().split('T')[0];
        }

        setFormData({
          nombre_completo: data.nombre_completo || '',
          dni: data.dni || '',
          telefono: data.telefono || '',
          mail: data.mail || '',
          direccion: data.direccion || '',
          sexo: data.sexo || 'M',
          fecha_nacimiento: fechaFormat
        });
      } catch (error) {
        alert('Error al cargar datos del cliente');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dni' || name === 'telefono') {
        setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // BLOQUEO ANTIDOBLE CLICK
    if (enviando) return;
    setEnviando(true);

    try {
      const respuesta = await clientesService.update(id, formData);
      
      // CASO DUPLICADO (CONFLICTO)
      if (respuesta.tipo === 'YA_EXISTE') {
        setModalConfig({
            isOpen: true,
            titulo: '⛔ No se puede guardar',
            mensaje: `El DNI ${formData.dni} ya pertenece al cliente "${respuesta.cliente.nombre_completo}".`,
            textoConfirmar: 'Entendido, voy a corregirlo',
            colorBoton: 'bg-red-600',
            accionConfirmar: () => setModalConfig({ ...modalConfig, isOpen: false })
        });
        setEnviando(false); // Liberamos botón para que corrija
        return;
      }

      // CASO ÉXITO
      // Mantenemos botón bloqueado (enviando=true) mientras se muestra el modal y redirige
      setShowExito(true);

    } catch (error) {
      console.error(error);
      alert('Error al guardar los cambios.');
      setEnviando(false); // Liberamos botón si hay error
    }
  };

  const finalizarEdicion = () => {
      setShowExito(false);
      navigate(-1); 
  };

  if (loading) return <div className="text-white text-center mt-10">Cargando formulario...</div>;

  return (
    <div className="p-6 flex flex-col gap-6 text-white pb-20 max-w-2xl mx-auto w-full">
      
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => navigate(-1)} className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-3 rounded-full active:scale-95 transition-all">
            ⬅️
        </button>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Editar Cliente
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        <FormInput 
            label="Nombre Completo" name="nombre_completo" required
            value={formData.nombre_completo} onChange={handleChange}
            disabled={enviando}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput 
                label="DNI" name="dni" type="tel" required maxLength={10}
                value={formData.dni} onChange={handleChange}
                disabled={enviando}
            />
            <FormSelect 
                label="Sexo" name="sexo" 
                value={formData.sexo} onChange={handleChange}
                disabled={enviando}
            >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
            </FormSelect>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormInput 
                label="Teléfono" name="telefono" type="tel"
                value={formData.telefono} onChange={handleChange}
                disabled={enviando}
            />
            <FormInput 
                label="Email" name="mail" type="email"
                value={formData.mail} onChange={handleChange}
                disabled={enviando}
            />
        </div>

        <FormInput 
            label="Dirección" name="direccion"
            value={formData.direccion} onChange={handleChange}
            disabled={enviando}
        />

        <FormInput 
            label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" required
            value={formData.fecha_nacimiento} onChange={handleChange}
            style={{ colorScheme: 'dark' }}
            disabled={enviando}
        />

        {/* BOTÓN ACTUALIZADO CON ESTADO DE CARGA */}
        <button 
            type="submit"
            disabled={enviando}
            className={`mt-6 w-full text-white font-bold text-lg tracking-wide py-4 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all duration-200 
            ${enviando 
                ? 'bg-blue-800 opacity-60 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] transform active:scale-[0.98]'
            }`}
        >
            {enviando ? 'PROCESANDO...' : 'GUARDAR CAMBIOS'}
        </button>

      </form>

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

      <ModalExito 
        isOpen={showExito}
        onClose={finalizarEdicion} 
        mensaje="Los datos del cliente se actualizaron correctamente."
      />

    </div>
  );
};

export default EditarCliente;