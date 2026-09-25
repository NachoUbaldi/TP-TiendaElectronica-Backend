const Category = require('../models/Category.model.js');
const Product = require('../models/Product.model.js');

// Crear categoría
exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
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
    // El { new: true } es para que devuelva la categoría ya actualizada, no la vieja
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
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