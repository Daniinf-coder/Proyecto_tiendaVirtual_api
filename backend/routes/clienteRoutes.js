const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Mapeo de rutas para la entidad cliente
router.get('/', clienteController.obtenerClientes);         // Leer todos
router.get('/:id', clienteController.obtenerClientePorId);   // Leer uno por ID
router.post('/', clienteController.crearCliente);           // Crear
router.put('/:id', clienteController.actualizarCliente);     // Actualizar por ID
router.delete('/:id', clienteController.eliminarCliente);   // Eliminar por ID

module.exports = router;
