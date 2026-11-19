// Importación de módulos necesarios
require('dotenv').config();
var express = require('express');              // Framework web para Node.js
var cookieParser = require('cookie-parser');  // Middleware para parsear cookies
var bluebird = require('bluebird');           // Promesas mejoradas para JS

//incorporo cors
var cors = require('cors'); // Middleware para habilitar CORS

// Importación de routers personalizados
var indexRouter = require('./routes/index');  // Rutas base
var apiRouter = require('./routes/api');      // Rutas API específicas del sistema


// Creación de la instancia de la aplicación Express
var app = express();

// Middleware para interpretar JSON y datos de formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Habilita CORS para el frontend configurado (o cualquier origen en desarrollo)
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'x-access-token', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Middleware para parsear cookies
app.use(cookieParser());

// Definición de rutas
app.use('/api', apiRouter);   // Las rutas que comienzan con /api usarán el router apiRouter
app.use('/', indexRouter);    // Las rutas base usarán el router indexRouter

// Respuesta JSON para rutas de API inexistentes
app.use('/api', function (req, res) {
  res.status(404).json({ message: 'Ruta de API no encontrada' });
});

// Manejo de errores globales (incluyendo JSON malformado en el body)
app.use(function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'JSON inválido en el cuerpo de la solicitud' });
  }
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

// Carga la configuración si el entorno es "Development"
if (process.env.NODE_ENV === 'Development') {
  require('./config').config();
}

// Conexión a la base de datos MongoDB usando Mongoose y Bluebird
var mongoose = require('mongoose')
mongoose.Promise = bluebird;
let url = process.env.MONGO_URI;
let opts = {
  useNewUrlParser : true, 
  connectTimeoutMS:20000, 
  useUnifiedTopology: true
  };

mongoose.connect(url,opts)
  .then(() => {
    console.log(`Succesfully Connected to the Mongodb Database..`)
  })
  .catch((e) => {
    console.log(`Error Connecting to the Mongodb Database...`),
    console.log(e)
  })

// Setup server port
var port = process.env.PORT || 4000;
// Escuchar en el puerto
app.listen(port,()=>{
    console.log('Servidor de ABM Users iniciado en el puerto ',port);
});

module.exports = app;