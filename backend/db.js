const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de Sequelize usando las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false, // Ponlo en true si quieres ver el SQL en la consola
  }
);

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