/**
 * Convierte un string "YYYY-MM-DD" a "DD/MM/YYYY"
 * Sin aplicar zonas horarias (evita el bug de restar 1 día).
 */
export const formatearFecha = (fechaString) => {
    if (!fechaString) return '---';
    // Si viene hora completa (ISO), nos quedamos solo con la parte YYYY-MM-DD
    const soloFecha = fechaString.split('T')[0];
    // Partimos por el guion: [2026, 01, 12]
    const [anio, mes, dia] = soloFecha.split('-');
    return `${dia}/${mes}/${anio}`;
  };

/**
 * Calcula cuántos días pasarons desde la fecha dada hasta hoy.
 * Retorna positivo si está vencido, negativo o 0 si está al día.
 */   
export const calcularDiasDeRetraso = (fechaVencimientoStr) => {
    if (!fechaVencimientoStr) return 0;
    
    // 1. Convertimos string a fecha local 00:00
    const [anio, mes, dia] = fechaVencimientoStr.split('-');
    const fechaVenc = new Date(anio, mes - 1, dia);

    // 2. Fecha de hoy 00:00 local
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // 3. Diferencia en días
    const diferenciaTime = hoy - fechaVenc;
    return Math.ceil(diferenciaTime / (1000 * 60 * 60 * 24));
};

  // Función visual para fechas
export const formatearFechaYHora = (fechaString) => {
    const fecha = new Date(fechaString);
    return {
        fecha: fecha.toLocaleDateString(),
        hora: fecha.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
  };
