const express = require('express');
const cors = require('cors');
const sequelize = require('./db'); 

// IMPORTAR RUTAS
const clientesRoutes = require('./routes/clientes'); 
const pagosRoutes = require('./routes/pagos');

const app = express();
const port = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE CORS (SEGURIDAD) ---
// Definimos quiénes tienen permiso de entrar
const allowedOrigins = [
  'http://localhost:5173', // Tu Frontend local (Vite)
  process.env.FRONTEND_URL // La URL que tendrá tu web en Render (La configuraremos luego)
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Permitido
    } 
    if (origin.startsWith('http://192.168')) {
         return callback(null, true);
    }

    console.error(`🚫 Bloqueado por CORS: ${origin}`);
    callback(new Error(`No permitido por CORS. Origen bloqueado: ${origin}`));
    
  },
  credentials: true // Permite cookies/headers si hicieran falta
}));

// Middlewares
app.use(express.json());

// USAR RUTAS
app.use('/api/clientes', clientesRoutes);
app.use('/api/pagos', pagosRoutes);

// RUTA DE PRUEBA (Health Check)
// Sirve para que Render sepa que tu app está viva
app.get('/', (req, res) => {
    res.send("Backend del Gimnasio Funcionando 🚀");
});

app.get('/test', async (req, res) => {
  try {
    const [results, metadata] = await sequelize.query('SELECT NOW()');
    res.json({ 
        mensaje: "¡Conexión exitosa con la Base de Datos!", 
        hora_servidor: results[0].now 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error del servidor: " + err.message);
  }
});

// Iniciar servidor
app.listen(port, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
  try {
      await sequelize.authenticate();
      console.log('✅ Base de Datos Sincronizada');
      // Opcional: sequelize.sync({ alter: true }); // Solo si necesitas actualizar tablas automáticamente
  } catch (error) {
      console.error('❌ Error de conexión:', error);
  }
});