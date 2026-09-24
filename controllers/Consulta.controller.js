const Consulta = require('../models/Consulta.model.js');

// Enviar una consulta (endpoint público del formulario de contacto)
exports.createConsulta = async (req, res) => {
  try {
    const consulta = new Consulta(req.body);
    await consulta.save();
    res.status(201).json({ message: 'Consulta enviada con éxito', consulta });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar consultas (solo admin)
exports.getConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.find().sort({ createdAt: -1 });
    res.json(consultas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cambiar el estado de una consulta: pendiente / leida / respondida (solo admin)
exports.updateEstadoConsulta = async (req, res) => {
  try {
    const { id } = req.params;
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
    const consulta = await Consulta.findByIdAndDelete(id);
    if (!consulta) {
      return res.status(404).json({ message: 'Consulta no encontrada' });
    }
    res.json({ message: 'Consulta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
