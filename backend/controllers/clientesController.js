const clientesService = require('../services/clientesService');

// Crear
const crear = async (req, res) => {
    try {
        const nuevoCliente = await clientesService.crearCliente(req.body);
        res.status(201).json(nuevoCliente);
    } catch (err) {
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: "El DNI ya está registrado" });
        }
        res.status(500).send("Error al crear el cliente");
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
        const clienteActualizado = await clientesService.actualizarCliente(id, req.body);
        res.json({ mensaje: "Cliente actualizado", cliente: clienteActualizado });
    } catch (err) {
        if (err.message === "CLIENTE_NO_ENCONTRADO") {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        console.error(err);
        res.status(500).send("Error al actualizar");
    }
};

// Eliminar (Lógico)
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

module.exports = {
    crear,
    listar,
    actualizar,
    eliminar,
    obtenerUno
};