const express = require('express');
const router = express.Router();
const productController = require('../../controllers/Product.controller');

// Rutas para la gestión de productos

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);

//rutas para modificar y eliminar (requieren el /:id en la URL)

router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;