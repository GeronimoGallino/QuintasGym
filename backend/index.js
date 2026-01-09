const express = require('express');
const cors = require('cors');
const sequelize = require('./db'); 

// IMPORTAR RUTAS (Agregamos esto para que funcione el CRUD)
const clientesRoutes = require('./routes/clientes'); 
const pagosRoutes = require('./routes/pagos');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// USAR RUTAS
app.use('/api/clientes', clientesRoutes);
app.use('/api/pagos', pagosRoutes);

// RUTA DE PRUEBA ACTUALIZADA (Sintaxis Sequelize)
app.get('/test', async (req, res) => {
  try {
    // sequelize.query devuelve un array con dos elementos: [resultados, metadata]
    const [results, metadata] = await sequelize.query('SELECT NOW()');
    
    res.json({ 
        mensaje: "¡Conexión exitosa con la Base de Datos!", 
        hora_servidor: results[0].now // Accedemos directo al resultado
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error del servidor: " + err.message);
  }
});

// Iniciar servidor (Sincronizando modelos primero es buena práctica)
app.listen(port, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
  try {
      // Esto verifica que la conexión sea correcta al iniciar
      await sequelize.authenticate();
      console.log('✅ Base de Datos Sincronizada');
  } catch (error) {
      console.error('❌ Error de conexión:', error);
  }
});