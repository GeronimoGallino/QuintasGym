const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión usando las variables del archivo .env
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

// Mensaje al conectarse exitosamente (o error)
pool.connect((err) => {
  if (err) {
    console.error('Error de conexión a la BD', err.stack);
  } else {
    console.log('✅ Base de Datos Conectada Exitosamente');
  }
});

module.exports = pool;