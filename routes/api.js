/**ROUTE USER & CATEGORY APIs. */

var express = require('express');
var router = express.Router();

//Importo los routers especificos de cada modelo
var userRouter = require('./api/user.routes.js');
var categoryRouter = require('./api/Category.routes.js');
var productRouter = require('./api/Product.routes.js');
var consultaRouter = require('./api/Consulta.routes.js');
var infoRouter = require('./api/InfoComercio.routes.js');

// Defino las rutas para cada modelo
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);
router.use('/consultas', consultaRouter);
router.use('/info', infoRouter);

// Exporto el router principal para que pueda ser utilizado en app.js
module.exports = router;
