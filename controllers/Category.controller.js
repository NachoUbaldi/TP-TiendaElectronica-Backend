const mongoose = require('mongoose');
const Category = require('../models/Category.model.js');
const Product = require('../models/Product.model.js');

// Crear categoría
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    res.status(400).json({ error: err.message });
  }
};

// Listar categorías
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ver una categoría por ID
exports.getCategoryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID de categoría inválido' });
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Modificar categoría
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de categoría inválido' });
    }
    // El { new: true, runValidators: true } devuelve la categoría actualizada y ejecuta validaciones
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    
    if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    res.status(400).json({ error: err.message });
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de categoría inválido' });
    }
    // No permitir eliminar una categoría que todavía tiene productos asociados,
    // para no dejar referencias colgantes en el catálogo
    const productosAsociados = await Product.exists({ categoria: id });
    if (productosAsociados) {
        return res.status(400).json({ message: 'No se puede eliminar la categoría porque tiene productos asociados' });
    }
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};