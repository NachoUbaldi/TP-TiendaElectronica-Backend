const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/Category.controller.js');
const auth = require('../../auth/authorization');

// Crear categoría (POST a /api/categories) - requiere admin
router.post('/', auth, auth.isAdmin, CategoryController.createCategory);

// Listar categorías (GET a /api/categories) - pública
router.get('/', CategoryController.getCategories);
router.get('/:id', CategoryController.getCategoryById);

// Modificar categoría (PUT a /api/categories/:id) - requiere admin
router.put('/:id', auth, auth.isAdmin, CategoryController.updateCategory);

// Eliminar categoría (DELETE a /api/categories/:id) - requiere admin
router.delete('/:id', auth, auth.isAdmin, CategoryController.deleteCategory);

module.exports = router;