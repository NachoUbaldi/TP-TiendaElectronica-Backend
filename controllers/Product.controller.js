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

// 2. Ver productos, con búsqueda y filtros opcionales:
//    ?nombre=texto  -> busca por nombre (ignora mayúsculas)
//    ?categoria=id  -> filtra por categoría
//    ?disponible=true|false -> filtra por disponibilidad
exports.getProducts = async (req, res) => {
    try {
        const filtro = {};
        if (req.query.nombre) {
            filtro.nombre = { $regex: req.query.nombre, $options: 'i' };
        }
        if (req.query.categoria) {
            filtro.categoria = req.query.categoria;
        }
        if (req.query.disponible === 'true' || req.query.disponible === 'false') {
            filtro.disponible = req.query.disponible === 'true';
        }
        // El .populate hace que además del ID de la categoría, nos traiga su nombre real
        const productos = await Product.find(filtro).populate('categoria', 'name');
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los productos",
            error: error.message
        });
    }
};

// 2b. Ver un producto por su id
exports.getProductById = async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id).populate('categoria', 'name');
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el producto",
            error: error.message
        });
    }
};

// 2c. Activar o desactivar un producto (disponible / no disponible)
exports.setDisponible = async (req, res) => {
    try {
        if (typeof req.body.disponible !== 'boolean') {
            return res.status(400).json({ mensaje: "El campo 'disponible' debe ser true o false" });
        }
        const producto = await Product.findByIdAndUpdate(
            req.params.id,
            { disponible: req.body.disponible },
            { new: true }
        );
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.status(200).json({
            mensaje: req.body.disponible ? "Producto activado" : "Producto desactivado",
            producto
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al cambiar la disponibilidad",
            error: error.message
        });
    }
};

// 3. Modificar un producto
exports.updateProduct = async (req, res) => {
    try {
        // El {new: true} es para que la base de datos nos devuelva el objeto ya modificado, no el viejo
        // runValidators: true hace que las validaciones del modelo también apliquen al update
        const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado para actualizar" });
        }
        
        res.status(200).json({ 
            mensaje: "Producto actualizado con éxito", 
            producto: productoActualizado 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                mensaje: "Datos del producto inválidos",
                error: error.message
            });
        }
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