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

const borrarPago = async (req, res) => {
    try {
        const { id } = req.params;
        await pagosService.eliminarPago(id);
        res.json({ message: "Pago eliminado con éxito" });

    } catch (err) {
        console.error(err);
        
        if (err.message === "PAGO_NO_ENCONTRADO") {
            return res.status(404).json({ message: "El pago no existe" });
        }

        // 👇 NUEVA RESPUESTA PARA LA REGLA DE SEGURIDAD
        if (err.message === "NO_ES_ULTIMO_PAGO") {
            return res.status(400).json({ 
                message: "Por seguridad, solo puedes eliminar el último pago realizado por este cliente." 
            });
        }
        
        // Nota: Cambié .send por .json({message: ...}) para que tu frontend lo lea mejor
        res.status(500).json({ message: "Error del servidor al eliminar pago" });
    }
};

module.exports = {
    crearPago,
    listarPorCliente,
    listarTodos,
    borrarPago
};