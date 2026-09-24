const express = require('express');
const router = express.Router();
const productController = require('../../controllers/Product.controller');
const auth = require('../../auth/authorization');

// Rutas para la gestión de productos
// Las lecturas (GET) son públicas; las escrituras requieren token

router.post('/', auth, auth.isAdmin, productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Activar/desactivar un producto (PATCH a /api/products/:id/disponible)
router.patch('/:id/disponible', auth, auth.isAdmin, productController.setDisponible);

//rutas para modificar y eliminar (requieren el /:id en la URL)

router.put('/:id', auth, auth.isAdmin, productController.updateProduct);
router.delete('/:id', auth, auth.isAdmin, productController.deleteProduct);

module.exports = router;