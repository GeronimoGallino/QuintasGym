// backend/services/pagosService.js
const Pago = require('../models/Pago');
const Cliente = require('../models/Cliente');
const { DateTime } = require('luxon');

// Configuración de zona horaria
const ZONA_HORARIA = 'America/Argentina/Buenos_Aires';

const registrarPago = async (datosPago) => {
    // 1. Recibimos 'fecha_inicio_personalizada' en lugar de reiniciar_ciclo
    const { cliente_id, monto, metodo_pago, cantidad_meses, fecha_inicio_personalizada } = datosPago;

    const cliente = await Cliente.findByPk(cliente_id);
    if (!cliente) {
        throw new Error("CLIENTE_NO_ENCONTRADO");
    }

    // 2. FECHA ACTUAL (Reloj de Argentina)
    const ahoraArgentina = DateTime.now().setZone(ZONA_HORARIA);
    const fechaParaGuardar = ahoraArgentina.toFormat('yyyy-MM-dd HH:mm:ss');
    
    // 3. CÁLCULO DE FECHA DE INICIO
    let fechaInicioObj; 

    if (fecha_inicio_personalizada) {
        // CASO A: El Profe eligió una fecha manual (Ej: Lunes pasado)
        // Usamos esa fecha como el inicio absoluto, ignorando vencimientos previos.
        // Asumimos que viene formato 'YYYY-MM-DD'
        fechaInicioObj = DateTime.fromISO(fecha_inicio_personalizada, { zone: ZONA_HORARIA });
    } else {
        // CASO B: Automático (Lógica original)
        if (!cliente.fecha_vencimiento) {
            fechaInicioObj = ahoraArgentina;
        } else {
            const fechaStr = new Date(cliente.fecha_vencimiento).toISOString().split('T')[0];
            const vencimientoActual = DateTime.fromISO(fechaStr, { zone: ZONA_HORARIA });
            
            fechaInicioObj = vencimientoActual.isValid ? vencimientoActual : ahoraArgentina;
        }
    }

    // 4. CÁLCULO DE FECHA DE FIN (VENCIMIENTO)
    let fechaFinObj;
    const mesesInt = parseInt(cantidad_meses);

    if (mesesInt === 0) {
        // NUEVA LÓGICA: PASE DIARIO
        // Si son 0 meses, damos 1 día de cobertura (vence mañana a la misma hora/fecha)
        fechaFinObj = fechaInicioObj.plus({ days: 1 });
    } else {
        // LÓGICA NORMAL: PASE MENSUAL
        fechaFinObj = fechaInicioObj.plus({ months: mesesInt });
    }

    // 5. OPERACIONES EN BASE DE DATOS
    const nuevoPago = await Pago.create({
        cliente_id,
        monto,
        metodo_pago,
        cantidad_meses: mesesInt,
        fecha_pago: fechaParaGuardar, // Fecha real de cuando entró la plata
        fecha_inicio_cobertura: fechaInicioObj.toISODate(), 
        fecha_fin_cobertura: fechaFinObj.toISODate()        
    });
    
    await cliente.update({
        fecha_vencimiento: fechaFinObj.toISODate(),
        activo: mesesInt == 0 ? false : true // Si es pase diario, no lo activamos
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

const eliminarPago = async (id) => {
    // 1. Buscamos el pago que queremos borrar
    const pagoAeliminar = await Pago.findByPk(id, {
        include: { model: Cliente }
    });

    if (!pagoAeliminar) {
        throw new Error("PAGO_NO_ENCONTRADO");
    }

    // =====================================================================
    // 🛡️ REGLA DE SEGURIDAD: SOLO EL ÚLTIMO PAGO DEL CLIENTE
    // =====================================================================
    
    // Buscamos cuál es el pago más reciente registrado para ESTE cliente
    const ultimoPagoReal = await Pago.findOne({
        where: { cliente_id: pagoAeliminar.cliente_id },
        order: [['id', 'DESC']] // Ordenamos por ID descendente (el más nuevo primero)
    });

    // Si el ID del pago que queremos borrar NO ES el del último pago...
    if (ultimoPagoReal && ultimoPagoReal.id !== pagoAeliminar.id) {
        throw new Error("NO_ES_ULTIMO_PAGO");
    }
    // =====================================================================


    const cliente = pagoAeliminar.Cliente;

    // LÓGICA DE ROLLBACK (Ahora es 100% segura porque sabemos que es el último)
    if (cliente && cliente.fecha_vencimiento && pagoAeliminar.fecha_fin_cobertura) {
        
        const vencimientoCliente = new Date(cliente.fecha_vencimiento).toISOString().split('T')[0];
        const finCoberturaPago = new Date(pagoAeliminar.fecha_fin_cobertura).toISOString().split('T')[0];

        // Al ser el último pago, esto casi siempre va a coincidir
        if (vencimientoCliente === finCoberturaPago) {
            await cliente.update({
                fecha_vencimiento: pagoAeliminar.fecha_inicio_cobertura
            });
        }
    }

    // 3. Eliminamos
    await pagoAeliminar.destroy();
    
    return { message: "Pago eliminado correctamente" };
};

module.exports = {
    registrarPago,
    obtenerHistorial,
    obtenerTodos,
    eliminarPago
};