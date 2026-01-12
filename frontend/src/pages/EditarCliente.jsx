import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clientesService } from '../services/clientes.service';
import ModalExito from '../components/ModalExito'; // 1. IMPORTAMOS EL MODAL

const EditarCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre_completo: '', dni: '', telefono: '', mail: '', 
    direccion: '', sexo: '', fecha_nacimiento: ''
  });

  // 2. ESTADO PARA CONTROLAR EL MODAL
  const [showExito, setShowExito] = useState(false);

  // Cargar datos actuales al entrar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await clientesService.getById(id);
        
        // Formatear la fecha para que el input type="date" la entienda (YYYY-MM-DD)
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

  // Manejar cambios en los inputs (Agregué la validación de números para DNI/Teléfono igual que en NuevoCliente)
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'dni' || name === 'telefono') {
        // Solo permite números
        setFormData({ ...formData, [name]: value.replace(/[^0-9]/g, '') });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // 3. GUARDAR CAMBIOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientesService.update(id, formData);
      
      // CAMBIO AQUÍ: Mostramos el modal en lugar del alert
      setShowExito(true);

    } catch (error) {
      alert('Error al guardar los cambios.');
    }
  };

  // 4. FUNCIÓN PARA CERRAR Y VOLVER AL PERFIL
  const finalizarEdicion = () => {
      setShowExito(false);
      navigate(-1); // Vuelve a la pantalla anterior (El perfil del cliente)
  };

  if (loading) return <div className="text-white text-center mt-10">Cargando formulario...</div>;

  return (
    <div className="p-4 flex flex-col min-h-screen">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="bg-gray-700 text-white p-2 rounded-full active:scale-95">⬅️</button>
        <h1 className="text-xl font-bold text-white">Editar Cliente</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Nombre */}
        <div>
            <label className="text-gray-400 text-sm ml-1">Nombre Completo</label>
            <input 
                type="text" name="nombre_completo" required
                value={formData.nombre_completo} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-blue-500 outline-none"
            />
        </div>

        {/* DNI y Sexo */}
        <div className="flex gap-2">
            <div className="w-2/3">
                <label className="text-gray-400 text-sm ml-1">DNI</label>
                <input 
                    type="tel" name="dni" required
                    value={formData.dni} onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
                    maxLength={10}
                />
            </div>
            <div className="w-1/3">
                <label className="text-gray-400 text-sm ml-1">Sexo</label>
                <select 
                    name="sexo" 
                    value={formData.sexo} onChange={handleChange}
                    className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none h-[58px]"
                >
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                </select>
            </div>
        </div>

        {/* Teléfono */}
        <div>
            <label className="text-gray-400 text-sm ml-1">Teléfono</label>
            <input 
                type="tel" name="telefono"
                value={formData.telefono} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
            />
        </div>

        {/* Email */}
        <div>
            <label className="text-gray-400 text-sm ml-1">Email</label>
            <input 
                type="email" name="mail"
                value={formData.mail} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
            />
        </div>

        {/* Dirección */}
        <div>
            <label className="text-gray-400 text-sm ml-1">Dirección</label>
            <input 
                type="text" name="direccion"
                value={formData.direccion} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
            />
        </div>

        {/* Fecha Nacimiento */}
        <div>
            <label className="text-gray-400 text-sm ml-1">Fecha de Nacimiento</label>
            <input 
                type="date" name="fecha_nacimiento"
                value={formData.fecha_nacimiento} onChange={handleChange}
                className="w-full p-4 rounded-xl bg-gray-800 text-white border border-gray-700 outline-none"
                style={{ colorScheme: 'dark' }}
            />
        </div>

        {/* Botón Guardar */}
        <button 
            type="submit"
            className="bg-blue-600 text-white p-4 rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition-transform"
        >
            GUARDAR CAMBIOS
        </button>

      </form>

      {/* 5. MODAL DE ÉXITO */}
      <ModalExito 
        isOpen={showExito}
        onClose={finalizarEdicion} // Al cerrar, ejecutamos navigate(-1)
        mensaje="Los datos del cliente se actualizaron correctamente."
      />

    </div>
  );
};

export default EditarCliente;