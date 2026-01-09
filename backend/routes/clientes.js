const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// Rutas definidas
router.post('/', clientesController.crear);
router.get('/', clientesController.listar);       // Sirve para listar todos O buscar (?nombre=Tal)
router.get('/:id', clientesController.obtenerUno); // Ver detalle de un cliente
router.put('/:id', clientesController.actualizar); // Modificar
router.delete('/:id', clientesController.eliminar); // Borrado Lógico

module.exports = router;    