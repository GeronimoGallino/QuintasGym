const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Importamos la conexión

const app = express();
const port = process.env.PORT || 3000;

// Middlewares (Para que el back entienda JSON y React pueda conectarse)
app.use(cors());
app.use(express.json());

// RUTA DE PRUEBA: Verificar que todo funciona
app.get('/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
        mensaje: "¡Conexión exitosa con la Base de Datos!", 
        hora_servidor: result.rows[0].now 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error del servidor");
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});