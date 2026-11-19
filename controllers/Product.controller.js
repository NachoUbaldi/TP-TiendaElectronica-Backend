const mongoose = require('mongoose');
const Product = require('../models/Product.model'); // Importamos el modelo que creaste
const Category = require('../models/Category.model');

function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Resuelve un ObjectId o nombre de categoría al _id existente en Category, o null si no existe
async function resolveCategoryId(categoria) {
    if (mongoose.Types.ObjectId.isValid(categoria)) {
        const exists = await Category.exists({ _id: categoria });
        return exists ? categoria : null;
    }
    if (typeof categoria === 'string' && categoria.trim()) {
        const catDoc = await Category.findOne({
            name: { $regex: `^${escapeRegex(categoria.trim())}$`, $options: 'i' }
        });
        return catDoc ? catDoc._id : null;
    }
    return null;
}

// 1. Crear un producto nuevo
exports.createProduct = async (req, res) => {
    try {
        if (req.body.categoria !== undefined) {
            const resolvedCatId = await resolveCategoryId(req.body.categoria);
            if (!resolvedCatId) {
                return res.status(400).json({ mensaje: "La categoría especificada no existe" });
            }
            req.body.categoria = resolvedCatId;
        }

        const nuevoProducto = new Product(req.body);
        await nuevoProducto.save();
        const productoPoblado = await Product.findById(nuevoProducto._id).populate('categoria', 'name');
        res.status(201).json({ 
            mensaje: "Producto creado con éxito", 
            producto: productoPoblado 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ mensaje: "Datos del producto inválidos", error: error.message });
        }
        res.status(500).json({ 
            mensaje: "Hubo un error al crear el producto", 
            error: error.message 
        });
    }
};

// 2. Ver productos, con búsqueda y filtros opcionales:
//    ?nombre=texto          -> busca por nombre (ignora mayúsculas)
//    ?search=texto | ?q=    -> busca en nombre o descripción (ignora mayúsculas)
//    ?categoria=id_o_nombre -> filtra por categoría (admite ObjectId o nombre de categoría)
//    ?disponible=true|false -> filtra por disponibilidad
//    ?destacado=true|false  -> filtra por publicaciones destacadas
//    ?minPrecio & ?maxPrecio-> filtra por rango de precio
exports.getProducts = async (req, res) => {
    try {
        const filtro = {};
        if (req.query.nombre) {
            filtro.nombre = { $regex: escapeRegex(req.query.nombre), $options: 'i' };
        }
        const searchTerm = req.query.search || req.query.q;
        if (searchTerm) {
            const safeSearch = escapeRegex(searchTerm);
            filtro.$or = [
                { nombre: { $regex: safeSearch, $options: 'i' } },
                { descripcion: { $regex: safeSearch, $options: 'i' } }
            ];
        }
        if (req.query.categoria) {
            const resolvedCatId = await resolveCategoryId(req.query.categoria);
            if (!resolvedCatId) {
                return res.status(200).json([]);
            }
            filtro.categoria = resolvedCatId;
        }
        if (req.query.disponible === 'true' || req.query.disponible === 'false') {
            filtro.disponible = req.query.disponible === 'true';
        }
        if (req.query.destacado === 'true' || req.query.destacado === 'false') {
            filtro.destacado = req.query.destacado === 'true';
        }
        if (req.query.minPrecio !== undefined || req.query.maxPrecio !== undefined) {
            filtro.precio = {};
            if (req.query.minPrecio !== undefined && req.query.minPrecio !== '') {
                const min = Number(req.query.minPrecio);
                if (isNaN(min)) return res.status(400).json({ mensaje: "minPrecio debe ser un número válido" });
                filtro.precio.$gte = min;
            }
            if (req.query.maxPrecio !== undefined && req.query.maxPrecio !== '') {
                const max = Number(req.query.maxPrecio);
                if (isNaN(max)) return res.status(400).json({ mensaje: "maxPrecio debe ser un número válido" });
                filtro.precio.$lte = max;
            }
            if (Object.keys(filtro.precio).length === 0) delete filtro.precio;
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID de producto inválido" });
        }
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID de producto inválido" });
        }
        if (typeof req.body.disponible !== 'boolean') {
            return res.status(400).json({ mensaje: "El campo 'disponible' debe ser true o false" });
        }
        const producto = await Product.findByIdAndUpdate(
            req.params.id,
            { disponible: req.body.disponible },
            { new: true }
        ).populate('categoria', 'name');
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID de producto inválido" });
        }
        if (req.body.categoria !== undefined) {
            const resolvedCatId = await resolveCategoryId(req.body.categoria);
            if (!resolvedCatId) {
                return res.status(400).json({ mensaje: "La categoría especificada no existe" });
            }
            req.body.categoria = resolvedCatId;
        }
        // El {new: true} es para que la base de datos nos devuelva el objeto ya modificado, no el viejo
        // runValidators: true hace que las validaciones del modelo también apliquen al update
        const productoActualizado = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('categoria', 'name');
        
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
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: "ID de producto inválido" });
        }
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