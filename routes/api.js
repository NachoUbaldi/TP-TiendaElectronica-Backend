/**ROUTE USER & CATEGORY APIs. */

var express = require('express');
var router = express.Router();

//Importo los routers especificos de cada modelo
var userRouter = require('./api/user.route');
var categoryRouter = require('./api/Category.routes');

// Defino las rutas para cada modelo
router.use('/users', userRouter);
router.use('/categories', categoryRouter);

// Exporto el router principal para que pueda ser utilizado en app.js
module.exports = router;
