const mongoose = require('mongoose');

// Datos institucionales del comercio: un único documento (singleton)
const InfoComercioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del comercio es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede superar los 100 caracteres']
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [1000, 'La descripción no puede superar los 1000 caracteres']
    },
    direccion: {
        type: String,
        trim: true,
        maxlength: [200, 'La dirección no puede superar los 200 caracteres']
    },
    telefono: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'El email no es válido']
    },
    redesSociales: {
        facebook: { type: String, trim: true },
        instagram: { type: String, trim: true },
        whatsapp: { type: String, trim: true }
    },
    horarios: {
        type: String,
        trim: true,
        maxlength: [300, 'Los horarios no pueden superar los 300 caracteres']
    }
}, { timestamps: true });

module.exports = mongoose.model('InfoComercio', InfoComercioSchema);
