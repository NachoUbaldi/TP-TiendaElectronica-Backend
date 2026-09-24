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
    { name: 'Notebooks', description: 'Computadoras portátiles para todos los usos' },
    { name: 'Celulares', description: 'Smartphones de todas las marcas' },
    { name: 'Tablets', description: 'Tablets para estudio, trabajo y entretenimiento' },
    { name: 'Audio', description: 'Auriculares, parlantes y más' },
    { name: 'Monitores', description: 'Monitores para oficina y gaming' },
    { name: 'Gaming y Accesorios', description: 'Periféricos y accesorios gamer' }
];

// El campo "cat" referencia al nombre de la categoría en categoriasSeed
const productosSeed = [
    { nombre: 'Notebook HP 15-dw', cat: 'Notebooks', descripcion: 'Pantalla 15.6", Intel i5, 8GB RAM, 256GB SSD', precio: 750000 },
    { nombre: 'Notebook Lenovo IdeaPad 3', cat: 'Notebooks', descripcion: 'Pantalla 15.6", Ryzen 5, 8GB RAM, 512GB SSD', precio: 680000 },
    { nombre: 'Notebook Dell Inspiron 14', cat: 'Notebooks', descripcion: 'Pantalla 14", Intel i7, 16GB RAM, 512GB SSD', precio: 890000 },
    { nombre: 'MacBook Air M1', cat: 'Notebooks', descripcion: 'Chip M1, 8GB RAM, 256GB SSD, 13.3"', precio: 1350000 },
    { nombre: 'Samsung Galaxy A54', cat: 'Celulares', descripcion: '128GB, 8GB RAM, cámara 50MP, 5G', precio: 420000 },
    { nombre: 'Motorola Edge 40', cat: 'Celulares', descripcion: '256GB, 8GB RAM, pantalla 144Hz, 5G', precio: 390000 },
    { nombre: 'iPhone 13', cat: 'Celulares', descripcion: '128GB, chip A15 Bionic, cámara dual', precio: 980000 },
    { nombre: 'Xiaomi Redmi Note 12', cat: 'Celulares', descripcion: '128GB, 6GB RAM, batería 5000mAh, AMOLED', precio: 250000 },
    { nombre: 'TCL 40 SE', cat: 'Celulares', descripcion: '128GB, 4GB RAM, pantalla 6.75" HD+', precio: 180000 },
    { nombre: 'iPad 10ª generación', cat: 'Tablets', descripcion: '64GB, WiFi, pantalla 10.9", chip A14', precio: 620000 },
    { nombre: 'Samsung Galaxy Tab A9', cat: 'Tablets', descripcion: '64GB, 4GB RAM, WiFi, pantalla 8.7"', precio: 280000 },
    { nombre: 'Lenovo Tab M10', cat: 'Tablets', descripcion: '64GB, 4GB RAM, WiFi, pantalla 10.1" Full HD', precio: 240000 },
    { nombre: 'Auriculares Sony WH-CH520', cat: 'Audio', descripcion: 'Bluetooth, hasta 50hs de batería, micrófono integrado', precio: 95000 },
    { nombre: 'Auriculares JBL Tune 510BT', cat: 'Audio', descripcion: 'Bluetooth, 40hs de batería, graves JBL Pure Bass', precio: 75000 },
    { nombre: 'Parlante JBL Go 3', cat: 'Audio', descripcion: 'Bluetooth, resistente al agua IP67, 5hs de batería', precio: 55000 },
    { nombre: 'Apple AirPods 2', cat: 'Audio', descripcion: 'Auriculares inalámbricos con estuche de carga', precio: 160000 },
    { nombre: 'Monitor Samsung 24" T350', cat: 'Monitores', descripcion: 'IPS, Full HD, 75Hz, HDMI y VGA', precio: 160000 },
    { nombre: 'Monitor LG 27" IPS', cat: 'Monitores', descripcion: 'Full HD, 75Hz, bordes ultradelgados', precio: 210000 },
    { nombre: 'Monitor Gamer Curvo 32"', cat: 'Monitores', descripcion: 'Curvo 1500R, 165Hz, 1ms, FreeSync', precio: 380000 },
    { nombre: 'Mouse Logitech G203', cat: 'Gaming y Accesorios', descripcion: 'Gaming, 8000 DPI, RGB Lightsync, 6 botones', precio: 45000 },
    { nombre: 'Teclado Mecánico Redragon Kumara', cat: 'Gaming y Accesorios', descripcion: 'Switches red, RGB, layout español, anti-ghosting', precio: 65000 },
    { nombre: 'Joystick PS5 DualSense', cat: 'Gaming y Accesorios', descripcion: 'Control inalámbrico para PlayStation 5 y PC', precio: 140000 }
];

const infoSeed = {
    nombre: 'Tienda Electrónica UADE',
    descripcion: 'Somos tu tienda de tecnología de confianza. Vendemos notebooks, celulares, tablets, audio y accesorios gamer con garantía oficial y los mejores precios del mercado.',
    direccion: 'Av. Lima 123, Ciudad Autónoma de Buenos Aires',
    telefono: '011 5555-4444',
    email: 'contacto@tiendaelectronica.com',
    redesSociales: {
        instagram: '@tiendaelectronica',
        facebook: 'TiendaElectronica',
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
