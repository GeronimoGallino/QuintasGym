import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * MODO ESPEJO: Muestra exactamente lo que recibe.
 * Elimina la "Z" si existe para evitar que el navegador cambie la hora.
 */

// Función auxiliar para limpiar la fecha
const limpiarFecha = (fechaString) => {
    if (!fechaString) return null;
    // Si viene con Z (UTC), se la sacamos para que sea "Local"
    return fechaString.endsWith('Z') ? fechaString.slice(0, -1) : fechaString;
};

export const formatearFecha = (fechaString) => {
    if (!fechaString) return '---';
    try {
        const fechaLimpia = limpiarFecha(fechaString);
        const fecha = parseISO(fechaLimpia);
        return format(fecha, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
        return '---';
    }
};

export const calcularDiasDeRetraso = (fechaVencimientoStr) => {
    if (!fechaVencimientoStr) return 0;
    const [anio, mes, dia] = fechaVencimientoStr.split('-');
    const fechaVenc = new Date(anio, mes - 1, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const diferenciaTime = hoy - fechaVenc;
    return Math.ceil(diferenciaTime / (1000 * 60 * 60 * 24));
};

export const formatearFechaYHora = (fechaString) => {
    if (!fechaString) return { fecha: '---', hora: '---' };

    try {
        // 1. Limpiamos la Z para que el navegador no intente "corregir" la hora
        const fechaLimpia = limpiarFecha(fechaString);
        
        // 2. Parseamos tal cual viene (11:00 sigue siendo 11:00)
        const fecha = parseISO(fechaLimpia);

        return {
            fecha: format(fecha, 'dd/MM/yyyy', { locale: es }),
            hora: format(fecha, 'HH:mm', { locale: es })
        };
    } catch (error) {
        console.error("Error formateando fecha:", error);
        return { fecha: 'Error', hora: 'Error' };
    }
};