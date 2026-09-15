const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true, // Esto es clave: evita que creen dos categorías con el mismo nombre
        trim: true, // Limpia espacios accidentales
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede superar los 50 caracteres']
    },
    description: {
        type: String,
        required: false, // Sigue siendo opcional
        trim: true,
        maxlength: [500, 'La descripción no puede superar los 500 caracteres']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', CategorySchema);