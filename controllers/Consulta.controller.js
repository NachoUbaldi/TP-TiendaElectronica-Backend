const mongoose = require('mongoose');
const Consulta = require('../models/Consulta.model.js');
const MailerService = require('../services/mailer.service.js');

const ESTADOS_VALIDOS = ['pendiente', 'leida', 'respondida'];

// Enviar una consulta (endpoint público del formulario de contacto)
exports.createConsulta = async (req, res) => {
  try {
    const consulta = new Consulta(req.body);
    await consulta.save();

    // Notificación por email (si hay SMTP configurado o logueo en modo DEV)
    MailerService.sendContactEmail(consulta).catch(err => {
      console.log('Error enviando notificación por email:', err.message);
    });

    res.status(201).json({ message: 'Consulta enviada con éxito', consulta });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar consultas (solo admin, con filtro opcional ?estado=pendiente|leida|respondida)
exports.getConsultas = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.estado) {
      if (!ESTADOS_VALIDOS.includes(req.query.estado)) {
        return res.status(400).json({ message: 'Estado inválido. Valores permitidos: pendiente, leida, respondida' });
      }
      filtro.estado = req.query.estado;
    }
    const consultas = await Consulta.find(filtro).sort({ createdAt: -1 });
    res.json(consultas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cambiar el estado de una consulta: pendiente / leida / respondida (solo admin)
exports.updateEstadoConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de consulta inválido' });
    }
    if (!req.body.estado || !ESTADOS_VALIDOS.includes(req.body.estado)) {
      return res.status(400).json({ message: 'El estado es obligatorio y debe ser: pendiente, leida o respondida' });
    }
    const consulta = await Consulta.findByIdAndUpdate(
      id,
      { estado: req.body.estado },
      { new: true, runValidators: true }
    );
    if (!consulta) {
      return res.status(404).json({ message: 'Consulta no encontrada' });
    }
    res.json(consulta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar una consulta (solo admin)
exports.deleteConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de consulta inválido' });
    }
    const consulta = await Consulta.findByIdAndDelete(id);
    if (!consulta) {
      return res.status(404).json({ message: 'Consulta no encontrada' });
    }
    res.json({ message: 'Consulta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
