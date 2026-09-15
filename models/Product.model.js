const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'],
        trim: true, // Borra espacios accidentales al principio y al final
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [100, 'El nombre no puede superar los 100 caracteres']
    },
    categoria: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', // Conecta obligatoriamente con el modelo de Categorías
        required: [true, 'La categoría es obligatoria']
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'],
        trim: true,
        maxlength: [1000, 'La descripción es demasiado larga']
    },
    imagenes: [{ 
        type: String, // Usamos un Array para permitir múltiples imágenes (Puntaje extra)
        trim: true
    }],
    precio: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo'] // El seguro anti-pérdidas
    },
    disponible: { 
        type: Boolean, 
        default: true // Por defecto, todo producto nuevo entra como disponible
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);