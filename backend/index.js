const express = require('express');
const cors = require('cors');
const sequelize = require('./db'); 

// IMPORTAR RUTAS
const clientesRoutes = require('./routes/clientes'); 
const pagosRoutes = require('./routes/pagos');

const app = express();
const port = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE CORS (SEGURIDAD) ---
const allowedOrigins = [
  'http://localhost:5173', 
  process.env.FRONTEND_URL 
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Permitir sin origen (Apps, Postman)
    if (!origin) return callback(null, true);
    
    // 2. Permitir si está en la lista (Render o Localhost)
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true); // <--- AGREGADO 'return'
    } 

    // 3. Permitir red local (Wi-Fi)
    if (origin.startsWith('http://192.168')) {
         return callback(null, true);
    }

    // 4. Bloquear el resto
    console.error(`🚫 Bloqueado por CORS: ${origin}`);
    return callback(new Error(`No permitido por CORS. Origen bloqueado: ${origin}`));
  },
  credentials: true 
}));

// Middlewares
app.use(express.json());

// USAR RUTAS
app.use('/api/clientes', clientesRoutes);
app.use('/api/pagos', pagosRoutes);

// RUTA DE PRUEBA
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
      console.log('✅ Base de Datos Conectada');
      
  } catch (error) {
      console.error('❌ Error de conexión:', error);
  }
});