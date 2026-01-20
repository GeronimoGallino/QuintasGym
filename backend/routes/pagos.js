// backend/routes/pagos.js
const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

// Definición de rutas
router.post('/', pagosController.crearPago);
router.get('/cliente/:id', pagosController.listarPorCliente);
router.get('/', pagosController.listarTodos);
router.delete('/:id', pagosController.borrarPago);

module.exports = router;