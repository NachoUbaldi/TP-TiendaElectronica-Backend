const express = require('express');
const router = express.Router();
const InfoController = require('../../controllers/InfoComercio.controller.js');
const auth = require('../../auth/authorization');

// Ver info del comercio (GET a /api/info) - pública
router.get('/', InfoController.getInfo);

// Crear/actualizar info del comercio (PUT a /api/info) - solo admin
router.put('/', auth, auth.isAdmin, InfoController.upsertInfo);

module.exports = router;
