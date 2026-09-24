const express = require('express');
const router = express.Router();
const ConsultaController = require('../../controllers/Consulta.controller.js');
const auth = require('../../auth/authorization');

// Enviar consulta (POST a /api/consultas) - pública: la usa el visitante desde el formulario de contacto
router.post('/', ConsultaController.createConsulta);

// Listar consultas (GET a /api/consultas) - solo admin
router.get('/', auth, auth.isAdmin, ConsultaController.getConsultas);

// Cambiar estado de una consulta (PUT a /api/consultas/:id/estado) - solo admin
router.put('/:id/estado', auth, auth.isAdmin, ConsultaController.updateEstadoConsulta);

// Eliminar consulta (DELETE a /api/consultas/:id) - solo admin
router.delete('/:id', auth, auth.isAdmin, ConsultaController.deleteConsulta);

module.exports = router;
