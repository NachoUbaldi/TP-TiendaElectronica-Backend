const mongoose = require('mongoose');

const ConsultaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede superar los 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'El email no es válido']
    },
    telefono: {
        type: String,
        required: false, // Opcional según la consigna
        trim: true
    },
    asunto: {
        type: String,
        required: [true, 'El asunto es obligatorio'],
        trim: true,
        maxlength: [150, 'El asunto no puede superar los 150 caracteres']
    },
    mensaje: {
        type: String,
        required: [true, 'El mensaje es obligatorio'],
        trim: true,
        maxlength: [2000, 'El mensaje no puede superar los 2000 caracteres']
    },
    estado: {
        type: String,
        enum: ['pendiente', 'leida', 'respondida'],
        default: 'pendiente'
    }
}, { timestamps: true });

module.exports = mongoose.model('Consulta', ConsultaSchema);
