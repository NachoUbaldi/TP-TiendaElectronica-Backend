// Seed de la base de datos: categorías, 20+ productos, info del comercio y usuario admin.
// ATENCIÓN: resetea las colecciones de categorías, productos, consultas e info del comercio.
// Uso: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const User = require('../models/User.model');
const InfoComercio = require('../models/InfoComercio.model');
const Consulta = require('../models/Consulta.model');

const categoriasSeed = [
    { name: 'Componentes y Hardware', description: 'Placas de video, procesadores, fuentes de alimentación y hardware de alto rendimiento' },
    { name: 'Domótica y Automatización', description: 'Módulos relé, actuadores, placas de desarrollo, sensores y pasarelas de red' },
    { name: 'Simuladores y Gaming', description: 'Volantes, bases direct drive, pedaleras y monitores ultrawide para simracing y gaming' },
    { name: 'Conectividad', description: 'Routers, adaptadores de red, sistemas mesh y conectividad avanzada' }
];

// El campo "cat" referencia al nombre de la categoría en categoriasSeed
const productosSeed = [
    // Componentes y Hardware
    { nombre: 'Placa de Video NVIDIA RTX 4070 Ti Super 16GB', cat: 'Componentes y Hardware', descripcion: '16GB GDDR6X, DLSS 3.5, Ray Tracing, triple fan para gaming 4K', precio: 1250000 },
    { nombre: 'Placa de Video AMD Radeon RX 7800 XT 16GB', cat: 'Componentes y Hardware', descripcion: '16GB GDDR6, arquitectura RDNA 3, interfaz 256-bit, DisplayPort 2.1', precio: 920000 },
    { nombre: 'Procesador Intel Core i7-14700K', cat: 'Componentes y Hardware', descripcion: '20 núcleos (8P + 12E), hasta 5.6 GHz, Socket LGA1700, desbloqueado para OC', precio: 620000 },
    { nombre: 'Procesador AMD Ryzen 7 7800X3D', cat: 'Componentes y Hardware', descripcion: '8 núcleos, 16 hilos, 96MB 3D V-Cache, Socket AM5, el mejor para gaming', precio: 680000 },
    { nombre: 'Fuente Corsair RM850e 850W Full Modular', cat: 'Componentes y Hardware', descripcion: 'Certificación 80 Plus Gold, condensadores 105°C, soporte ATX 3.0 y PCIe 5.0', precio: 210000 },
    { nombre: 'Fuente EVGA 700W GD 80 Plus Gold', cat: 'Componentes y Hardware', descripcion: '700W de potencia continua, eficiencia 90%, protección contra sobretensión', precio: 155000 },

    // Domótica y Automatización
    { nombre: 'Módulo Relé WiFi Inteligente Sonoff Mini R2', cat: 'Domótica y Automatización', descripcion: 'Interruptor inteligente DIY bidireccional, compatible con Alexa, Google Home y eWeLink', precio: 18000 },
    { nombre: 'Actuador Lineal Eléctrico 12V 100mm', cat: 'Domótica y Automatización', descripcion: 'Carrera de 100mm, fuerza de empuje 750N, velocidad 10mm/s con finales de carrera', precio: 65000 },
    { nombre: 'Placa de Desarrollo ESP32 Wi-Fi + Bluetooth', cat: 'Domótica y Automatización', descripcion: 'Módulo NodeMCU ESP-WROOM-32, 30 pines, microUSB, doble núcleo 240MHz', precio: 14500 },
    { nombre: 'Placa de Desarrollo Arduino Uno R3 ATmega328P', cat: 'Domótica y Automatización', descripcion: 'Microcontrolador ATmega328P original, 14 pines E/S digitales, 6 entradas analógicas', precio: 22000 },
    { nombre: 'Sensor de Temperatura y Humedad DHT22 (AM2302)', cat: 'Domótica y Automatización', descripcion: 'Sensor digital de alta precisión para proyectos domóticos e IoT', precio: 9800 },
    { nombre: 'Sensor de Movimiento Infrarrojo PIR HC-SR501', cat: 'Domótica y Automatización', descripcion: 'Sensor piroeléctrico para detección de presencia con ajuste de sensibilidad y tiempo', precio: 5200 },
    { nombre: 'Pasarela de Red Gateway Zigbee 3.0 Tuya Smart', cat: 'Domótica y Automatización', descripcion: 'Hub inalámbrico multi-dispositivo Zigbee y Bluetooth Mesh para control de sensores y relés', precio: 48000 },

    // Simuladores y Gaming
    { nombre: 'Volante y Pedalera Logitech G29 Driving Force', cat: 'Simuladores y Gaming', descripcion: 'Force Feedback de dos motores, pedalera con freno no lineal, compatible con PC y PS4/PS5', precio: 450000 },
    { nombre: 'Base Direct Drive Moza Racing R9 V2 (9 Nm)', cat: 'Simuladores y Gaming', descripcion: 'Motor Direct Drive industrial de 9 Nm de torque, carcasa de aluminio de aviación', precio: 890000 },
    { nombre: 'Volante Moza GS V2P GT Wheel Alcántara', cat: 'Simuladores y Gaming', descripcion: 'Aro estilo GT en fibra de carbono forjada, levas magnéticas duales y empuñaduras de alcántara', precio: 720000 },
    { nombre: 'Pedalera Fanatec ClubSport Pedals V3', cat: 'Simuladores y Gaming', descripcion: 'Pedalera de aluminio con celda de carga de 90kg en freno y sensores magnéticos Hall', precio: 780000 },
    { nombre: 'Monitor Ultrawide Curvo Samsung Odyssey G9 49"', cat: 'Simuladores y Gaming', descripcion: 'Dual QHD 5120x1440, curvatura 1000R, panel QLED 240Hz, 1ms, G-Sync compatible', precio: 2100000 },
    { nombre: 'Monitor Gamer Ultrawide LG 34" UltraGear 160Hz', cat: 'Simuladores y Gaming', descripcion: 'Resolución WQHD 3440x1440, panel curvo IPS, 160Hz, 1ms MBR, HDR10', precio: 890000 },

    // Conectividad
    { nombre: 'Router Wi-Fi 6 TP-Link Archer AX73 Gigabit', cat: 'Conectividad', descripcion: 'AX5400 Dual-Band, 6 antenas de alta ganancia, tecnología OneMesh y puerto USB 3.0', precio: 195000 },
    { nombre: 'Sistema Mesh ASUS ZenWiFi XT8 WiFi 6 AX6600', cat: 'Conectividad', descripcion: 'Pack x2 nodos tri-banda, cobertura hasta 500 m², puerto 2.5G WAN y seguridad AiProtection', precio: 580000 },
    { nombre: 'Adaptador PCI-e WiFi 6E TP-Link Archer TXE75E', cat: 'Conectividad', descripcion: 'Tri-Banda (6GHz, 5GHz, 2.4GHz), Bluetooth 5.3, disipador de calor y antenas magnetizadas', precio: 88000 },
    { nombre: 'Adaptador USB WiFi TP-Link Archer T3U Plus', cat: 'Conectividad', descripcion: 'AC1300 Dual Band con antena desmontable de alta ganancia de 5dBi, USB 3.0', precio: 32000 }
];

const infoSeed = {
    nombre: 'Tienda Electrónica & Hardware UADE',
    descripcion: 'Especialistas en componentes de alta gama para PC, simracing profesional, domótica inteligente y soluciones de conectividad de red con garantía oficial.',
    direccion: 'Av. Lima 123, Ciudad Autónoma de Buenos Aires',
    telefono: '011 5555-4444',
    email: 'contacto@tiendaelectronica.com',
    redesSociales: {
        instagram: '@tiendaelectronica_tech',
        facebook: 'TiendaElectronicaHardware',
        whatsapp: '1155554444'
    },
    horarios: 'Lunes a Viernes de 9 a 18 hs | Sábados de 9 a 13 hs'
};

async function seed() {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');

    // Reset de colecciones de contenido (los usuarios se conservan)
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Consulta.deleteMany({});
    await InfoComercio.deleteMany({});
    console.log('Colecciones de categorías, productos, consultas e info reseteadas');

    const categoriasCreadas = await Category.insertMany(categoriasSeed);
    console.log(categoriasCreadas.length + ' categorías creadas');

    const idPorCategoria = {};
    categoriasCreadas.forEach(c => { idPorCategoria[c.name] = c._id; });

    const productos = productosSeed.map(p => ({
        nombre: p.nombre,
        categoria: idPorCategoria[p.cat],
        descripcion: p.descripcion,
        precio: p.precio,
        disponible: true
    }));
    const productosCreados = await Product.insertMany(productos);
    console.log(productosCreados.length + ' productos creados');

    await InfoComercio.create(infoSeed);
    console.log('Información del comercio cargada');

    // Admin de prueba: solo si todavía no existe ningún admin
    const adminExistente = await User.findOne({ role: 'admin' });
    if (!adminExistente) {
        await User.create({
            name: 'Admin',
            apellido: 'Tienda',
            email: 'admin@tienda.com',
            telefono: '01155554444',
            password: bcrypt.hashSync('admin123', 8),
            role: 'admin'
        });
        console.log('Usuario admin creado: admin@tienda.com / admin123');
    } else {
        console.log('Ya existe un admin (' + adminExistente.email + '), no se creó otro');
    }

    await mongoose.disconnect();
    console.log('Seed completada con éxito');
}

seed().catch(e => {
    console.error('Error en el seed:', e.message);
    process.exit(1);
});
