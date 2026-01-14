const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// OBTENER CONFIGURACIÓN SEGÚN EL ENTORNO
// Render usa una "DATABASE_URL" larga. En local usamos variables sueltas.
const connectionString = process.env.DATABASE_URL;

// CONFIGURACIÓN SSL (Obligatorio para Render, opcional para Local)
// Si estamos en producción (hay DATABASE_URL), activamos SSL.
const dialectOptions = connectionString ? {
  ssl: {
    require: true,
    rejectUnauthorized: false // Esto evita errores con certificados auto-firmados de Render
  }
} : {};

if (connectionString) {
  // --- MODO PRODUCCIÓN (RENDER) ---
  console.log("🌍 Conectando a Base de Datos en la NUBE...");
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: dialectOptions
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
    }
  );
}

// Probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión con Sequelize exitosa');
  } catch (error) {
    console.error('❌ Error conectando a la BD:', error);
  }
})();

module.exports = sequelize;