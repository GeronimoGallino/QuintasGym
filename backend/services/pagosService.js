// backend/services/pagosService.js
const Pago = require('../models/Pago');
const Cliente = require('../models/Cliente');

// Función auxiliar (ahora privada del servicio)
function sumarMeses(fecha, meses) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + meses);
    return nuevaFecha;
}

const registrarPago = async (datosPago) => {
    const { cliente_id, monto, metodo_pago, cantidad_meses, reiniciar_ciclo } = datosPago;

    // 1. Validaciones de negocio
    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
        throw new Error("CLIENTE_NO_ENCONTRADO");
    }

    // 2. Cálculo de fechas (La lógica heavy)
    const fechaActual = new Date();
    let fechaInicio;

    if (reiniciar_ciclo === true) {
        fechaInicio = fechaActual;
    } else {
        if (!cliente.fecha_vencimiento) {
            fechaInicio = fechaActual;
        } else {
            const vencimientoActual = new Date(cliente.fecha_vencimiento);
            fechaInicio = isNaN(vencimientoActual) ? fechaActual : vencimientoActual;
        }
    }

    const fechaFin = sumarMeses(fechaInicio, parseInt(cantidad_meses));

    // 3. Operaciones en Base de Datos
    const nuevoPago = await Pago.create({
        cliente_id,
        monto,
        metodo_pago,
        cantidad_meses,
        fecha_inicio_cobertura: fechaInicio,
        fecha_fin_cobertura: fechaFin
    });

    await cliente.update({
        fecha_vencimiento: fechaFin,
        activo: true
    });

    // 4. Retornar solo los datos procesados
    return {                                  
        pago: nuevoPago,   //modificar aca el mensaje cuando se realiza un pago
        nuevo_vencimiento_cliente: fechaFin
    };
};

const obtenerHistorial = async (cliente_id) => {
    return await Pago.findAll({
        where: { cliente_id },
        order: [['fecha_pago', 'DESC']]
    });
};

const obtenerTodos = async () => {
    // findAll busca todos. 
    return await Pago.findAll({
        include: {
            model: Cliente,
            attributes: ['nombre_completo', 'dni'] 
        },
        order: [['fecha_pago', 'DESC']], // Los más nuevos arriba
        limit: 100 // Limitamos a los últimos 100 pagos
    });
};


module.exports = {
    registrarPago,
    obtenerHistorial,
    obtenerTodos
};