// backend/controllers/pagosController.js
const pagosService = require('../services/pagosService');

const crearPago = async (req, res) => {
    try {
        // Delegamos la lógica al servicio
        const resultado = await pagosService.registrarPago(req.body);
        res.json(resultado);

    } catch (err) {
        console.error(err);
        // Manejo de errores específicos
        if (err.message === "CLIENTE_NO_ENCONTRADO") {
            return res.status(404).json({ error: "Cliente no encontrado" });
        }
        res.status(500).send("Error del servidor: " + err.message);
    }
};

const listarPorCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const pagos = await pagosService.obtenerHistorial(id);
        res.json(pagos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error del servidor");
    }
};

const listarTodos = async (req, res) => {
    try {
        const pagos = await pagosService.obtenerTodos();
        res.json(pagos);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener los pagos");
    }
};

module.exports = {
    crearPago,
    listarPorCliente,
    listarTodos
};