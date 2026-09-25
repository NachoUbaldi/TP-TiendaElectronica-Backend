const express = require('express');
const router = express.Router();
const InfoController = require('../../controllers/InfoComercio.controller.js');
const auth = require('../../auth/authorization');

// Ver info del comercio (GET a /api/info) - pública
router.get('/', InfoController.getInfo);

// Crear/actualizar info del comercio (POST o PUT a /api/info) - solo admin
router.post('/', auth, auth.isAdmin, InfoController.upsertInfo);
router.put('/', auth, auth.isAdmin, InfoController.upsertInfo);

module.exports = router;
