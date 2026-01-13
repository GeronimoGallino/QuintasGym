const clientesService = require('../services/clientesService');
const Cliente = require('../models/Cliente');

// Crear
const crear = async (req, res) => {
    try {
        const { dni } = req.body;

        // 1. Buscamos si ya existe alguien con ese DNI
        const existente = await Cliente.findOne({ where: { dni } });

        if (existente) {
            // CASO A: Ya existe y está ACTIVO
            if (existente.activo) {
                return res.status(200).json({ 
                    tipo: 'YA_EXISTE_ACTIVO', 
                    mensaje: 'El cliente ya está registrado y activo.',
                    cliente: existente 
                });
            } 
            // CASO B: Existe pero está INACTIVO (Borrado lógico)
            else {
                return res.status(200).json({ 
                    tipo: 'YA_EXISTE_INACTIVO', 
                    mensaje: 'El cliente existe en el historial pero está inactivo.',
                    cliente: existente 
                });
            }
        }

        // CASO C: No existe, procedemos a crear uno nuevo
        const nuevoCliente = await clientesService.crearCliente(req.body);
        res.status(201).json({ tipo: 'CREADO', cliente: nuevoCliente });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error al procesar la solicitud");
    }
};

// Listar (y Buscar)
const listar = async (req, res) => {
    try {
        // Obtenemos el parámetro 'nombre' de la URL (ej: ?nombre=Juan)
        const { nombre } = req.query; 
        const clientes = await clientesService.obtenerClientes(nombre);
        res.json(clientes);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al listar clientes");
    }
};

// Actualizar
const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        // LLAMAMOS AL SERVICIO
        const respuestaServicio = await clientesService.actualizarCliente(id, req.body);
        // EVALUAMOS QUÉ NOS DIJO EL SERVICIO
        if (respuestaServicio.resultado === 'DUPLICADO') {
            return res.status(200).json({ 
                tipo: 'YA_EXISTE', 
                mensaje: 'El DNI ya está en uso.',
                cliente: respuestaServicio.clienteExistente
            });
        }

        // Caso B: Todo salió rico
        res.status(200).json({ tipo: 'OK', message: "Cliente actualizado correctamente" });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error al procesar la solicitud");
    }
};// Eliminar (Lógico)
const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await clientesService.eliminarCliente(id);
        res.json({ mensaje: "Cliente dado de baja exitosamente" });
    } catch (err) {
        if (err.message === "CLIENTE_NO_ENCONTRADO") {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        console.error(err);
        res.status(500).send("Error al eliminar");
    }
};

// Obtener uno solo
const obtenerUno = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await clientesService.obtenerPorId(id);
        res.json(cliente);
    } catch (err) {
        if (err.message === "CLIENTE_NO_ENCONTRADO") {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        res.status(500).send("Error del servidor");
    }
}

// Listar solo vencidos
const listarVencidos = async (req, res) => {
    try {
        const vencidos = await clientesService.obtenerVencidos();
        res.json(vencidos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener clientes vencidos");
    }
}

module.exports = {
    crear,
    listar,
    actualizar,
    eliminar,
    obtenerUno,
    listarVencidos
};