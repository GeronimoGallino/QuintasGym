const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// OBTENER CONFIGURACIÓN SEGÚN EL ENTORNO
const connectionString = process.env.DATABASE_URL;

// 1. CONFIGURACIÓN BASE (Igual para Local y Render)
// Esto es lo que te faltaba: Forzamos a que NO toque las horas.
const dialectOptions = {
  useUTC: false,       // No convertir a UTC
  dateStrings: true,   // Leer fecha como string (texto)
  typeCast: true       // No intentar interpretar zonas horarias
};

// 2. CONFIGURACIÓN SSL (Solo si estamos en Render/Producción)
if (connectionString) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false // Evita errores con certificados de Render
  };
}

// 3. INICIALIZAR LA CONEXIÓN
if (connectionString) {
  // --- MODO PRODUCCIÓN (RENDER) ---
  console.log("🌍 Conectando a Base de Datos en la NUBE...");
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: dialectOptions // Aquí van las reglas de fecha + SSL
  });

} else {
  // --- MODO DESARROLLO (LOCAL) ---
  console.log("💻 Conectando a Base de Datos LOCAL...");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT,
      logging: false,
      dialectOptions: dialectOptions // Aquí van las reglas de fecha (sin SSL)
    }
  );
}

// Probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con Sequelize exitosa (Modo Texto/Raw)');
  } catch (error) {
    console.error('❌ Error conectando a la BD:', error);
  }
})();

module.exports = sequelize;