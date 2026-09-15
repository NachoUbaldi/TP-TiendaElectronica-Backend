/**ROUTE USER & CATEGORY APIs. */

var express = require('express');
var router = express.Router();

//Importo los routers especificos de cada modelo
var userRouter = require('./api/user.route');
var categoryRouter = require('./api/Category.routes');
var productRouter = require('./api/Product.routes');

// Defino las rutas para cada modelo
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/products', productRouter);

// Exporto el router principal para que pueda ser utilizado en app.js
module.exports = router;
