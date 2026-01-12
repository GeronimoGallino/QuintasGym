const Cliente = require('../models/Cliente');
const { Op } = require('sequelize'); // Importamos operadores para la búsqueda

// 1. CREAR
const crearCliente = async (datosCliente) => {
    return await Cliente.create(datosCliente);
};

// 2. LISTAR (Con lógica de filtro opcional)
const obtenerClientes = async (filtroNombre) => {
    let opciones = {
        order: [['id', 'DESC']]
    };

    // Si nos pasan un nombre, agregamos el filtro WHERE
    if (filtroNombre) {
        opciones.where = {
            nombre_completo: {
                // Op.iLike es "Case Insensitive Like" (busca mayúsculas y minúsculas en Postgres)
                // %texto% significa "que contenga este texto en cualquier parte"
                [Op.iLike]: `%${filtroNombre}%` 
            }
        };
    }

    return await Cliente.findAll(opciones);
};

// 3. ACTUALIZAR
const actualizarCliente = async (id, datosNuevos) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
        throw new Error("CLIENTE_NO_ENCONTRADO");
    }
    
    // Actualizamos los campos
    return await cliente.update(datosNuevos);
};

// 4. BORRADO LÓGICO (No borramos el registro, solo lo desactivamos)
const eliminarCliente = async (id) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
        throw new Error("CLIENTE_NO_ENCONTRADO");
    }

    // Cambiamos el estado a false
    return await cliente.update({ activo: false });
};

// 5. OBTENER POR ID (Útil para detalles)
const obtenerPorId = async (id) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) throw new Error("CLIENTE_NO_ENCONTRADO");
    return cliente;
};

// 6. OBTENER VENCIDOS (Nueva función)
const obtenerVencidos = async () => {
    const hoy = new Date(); // Fecha y hora actual
    
    return await Cliente.findAll({
        where: {
            fecha_vencimiento: {
                [Op.lt]: hoy, // "lt" significa Less Than (Menor que hoy)
                [Op.ne]: null // Aseguramos que no sea nulo (ne = Not Equal)
            },
            activo: true // Opcional: Solo traemos los que no están borrados
        },
        order: [['fecha_vencimiento', 'DESC']] // Mostramos los más recientes primero (inverso)
    });
};

module.exports = {
    crearCliente,
    obtenerClientes,
    actualizarCliente,
    eliminarCliente,
    obtenerPorId,
    obtenerVencidos
};