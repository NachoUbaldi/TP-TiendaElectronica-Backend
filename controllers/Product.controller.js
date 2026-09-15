const Product = require('../models/Product.model'); // Importamos el modelo que creaste

// 1. Crear un producto nuevo
exports.createProduct = async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        res.status(201).json({ 
            mensaje: "Producto creado con éxito", 
            producto: nuevoProducto 
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Hubo un error al crear el producto", 
            error: error.message 
        });
    }
};

// 2. Ver todos los productos
exports.getProducts = async (req, res) => {
    try {
        // El .populate hace que además del ID de la categoría, nos traiga su nombre real
        const productos = await Product.find().populate('categoria', 'name'); 
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener los productos", 
            error: error.message 
        });
    }
};

// 3. Modificar un producto
exports.updateProduct = async (req, res) => {
    try {
        // El {new: true} es para que la base de datos nos devuelva el objeto ya modificado, no el viejo
        const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado para actualizar" });
        }
        
        res.status(200).json({ 
            mensaje: "Producto actualizado con éxito", 
            producto: productoActualizado 
        });
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al modificar el producto", 
            error: error.message 
        });
    }
};

// 4. Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const productoEliminado = await Product.findByIdAndDelete(req.params.id);
        
        if (!productoEliminado) {
            return res.status(404).json({ mensaje: "Producto no encontrado para eliminar" });
        }
        
        res.status(200).json({ mensaje: "Producto eliminado correctamente del catálogo" });
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al eliminar el producto", 
            error: error.message 
        });
    }
};