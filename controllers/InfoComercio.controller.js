const InfoComercio = require('../models/InfoComercio.model.js');

// Ver la información del comercio (pública)
exports.getInfo = async (req, res) => {
  try {
    const info = await InfoComercio.findOne();
    if (!info) {
      return res.status(404).json({ message: 'Todavía no se cargó la información del comercio' });
    }
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear o actualizar la información del comercio (solo admin, un único documento)
exports.upsertInfo = async (req, res) => {
  try {
    const info = await InfoComercio.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.json(info);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
