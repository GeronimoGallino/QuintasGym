// backend/services/pagosService.js
const Pago = require('../models/Pago');
const Cliente = require('../models/Cliente');
const { DateTime } = require('luxon');

// Configuración de zona horaria
const ZONA_HORARIA = 'America/Argentina/Buenos_Aires';

const registrarPago = async (datosPago) => {
    const { cliente_id, monto, metodo_pago, cantidad_meses, reiniciar_ciclo } = datosPago;

    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
        throw new Error("CLIENTE_NO_ENCONTRADO");
    }

    // 1. OBTENER FECHA ACTUAL (Reloj de Argentina)
    const ahoraArgentina = DateTime.now().setZone(ZONA_HORARIA);

    const fechaParaGuardar = ahoraArgentina.toFormat('yyyy-MM-dd HH:mm:ss');
    
    // 3. CÁLCULO DE FECHAS DE COBERTURA
    let fechaInicioObj; 

    if (reiniciar_ciclo === true) {
        fechaInicioObj = ahoraArgentina;
    } else {
        if (!cliente.fecha_vencimiento) {
            fechaInicioObj = ahoraArgentina;
        } else {
            // Leemos la fecha de la DB y la interpretamos como Argentina
            // (Usamos toISODate para evitar problemas de horas en fechas viejas)
            const fechaStr = new Date(cliente.fecha_vencimiento).toISOString().split('T')[0];
            const vencimientoActual = DateTime.fromISO(fechaStr, { zone: ZONA_HORARIA });
            
            fechaInicioObj = vencimientoActual.isValid ? vencimientoActual : ahoraArgentina;
        }
    }

    // Sumar meses (Luxon maneja bien los bisiestos y finales de mes)
    const fechaFinObj = fechaInicioObj.plus({ months: parseInt(cantidad_meses) });

    // 4. OPERACIONES EN BASE DE DATOS
    const nuevoPago = await Pago.create({
        cliente_id,
        monto,
        metodo_pago,
        cantidad_meses,
        fecha_pago: fechaParaGuardar, // <--- Aquí va la fecha "visual" corregida
        fecha_inicio_cobertura: fechaInicioObj.toISODate(), // Mandamos solo string YYYY-MM-DD
        fecha_fin_cobertura: fechaFinObj.toISODate()        // Mandamos solo string YYYY-MM-DD
    });

    await cliente.update({
        fecha_vencimiento: fechaFinObj.toISODate(),
        activo: true
    });

    return {                                  
        pago: nuevoPago,   
        nuevo_vencimiento_cliente: fechaFinObj.toISODate()
    };
};

const obtenerHistorial = async (cliente_id) => {
    return await Pago.findAll({
        where: { cliente_id },
        order: [['fecha_pago', 'DESC']]
    });
};

const obtenerTodos = async () => {
    return await Pago.findAll({
        include: {
            model: Cliente,
            attributes: ['nombre_completo', 'dni'] 
        },
        order: [['fecha_pago', 'DESC']],
        limit: 100 
    });
};

module.exports = {
    registrarPago,
    obtenerHistorial,
    obtenerTodos
};