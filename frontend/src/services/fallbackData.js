export const INITIAL_CATEGORIES = [
  {
    _id: 'cat-hardware',
    name: 'Componentes y Hardware',
    description: 'Placas de video, procesadores, fuentes de alimentación y hardware de alto rendimiento'
  },
  {
    _id: 'cat-domotica',
    name: 'Domótica y Automatización',
    description: 'Módulos relé, actuadores, placas de desarrollo, sensores y pasarelas de red'
  },
  {
    _id: 'cat-simracing',
    name: 'Simuladores y Gaming',
    description: 'Volantes, bases direct drive, pedaleras y monitores ultrawide para simracing y gaming'
  },
  {
    _id: 'cat-conectividad',
    name: 'Conectividad',
    description: 'Routers, adaptadores de red, sistemas mesh y conectividad avanzada'
  }
];

export const INITIAL_PRODUCTS = [
  // Componentes y Hardware
  {
    _id: 'prod-1',
    nombre: 'Placa de Video NVIDIA RTX 4070 Ti Super 16GB',
    categoria: { _id: 'cat-hardware', name: 'Componentes y Hardware' },
    descripcion: '16GB GDDR6X, DLSS 3.5, Ray Tracing de última generación y sistema triple fan para gaming 4K extremo y renderizado profesional.',
    precio: 1250000,
    disponible: true,
    destacado: true,
    imagenes: [
      'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-2',
    nombre: 'Placa de Video AMD Radeon RX 7800 XT 16GB',
    categoria: { _id: 'cat-hardware', name: 'Componentes y Hardware' },
    descripcion: '16GB GDDR6, arquitectura RDNA 3, interfaz 256-bit y DisplayPort 2.1 con refrigeración avanzada.',
    precio: 920000,
    disponible: true,
    destacado: true,
    imagenes: [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-3',
    nombre: 'Procesador Intel Core i7-14700K',
    categoria: { _id: 'cat-hardware', name: 'Componentes y Hardware' },
    descripcion: '20 núcleos (8P + 12E), hasta 5.6 GHz, Socket LGA1700, desbloqueado para overclocking de alto desempeño.',
    precio: 620000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-4',
    nombre: 'Procesador AMD Ryzen 7 7800X3D',
    categoria: { _id: 'cat-hardware', name: 'Componentes y Hardware' },
    descripcion: '8 núcleos, 16 hilos, 96MB 3D V-Cache, Socket AM5, máximo rendimiento en gaming competitivo.',
    precio: 680000,
    disponible: true,
    destacado: true,
    imagenes: [
      'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-5',
    nombre: 'Fuente Corsair RM850e 850W Full Modular',
    categoria: { _id: 'cat-hardware', name: 'Componentes y Hardware' },
    descripcion: 'Certificación 80 Plus Gold, condensadores 105°C, soporte nativo ATX 3.0 y PCIe 5.0 ultra silenciosa.',
    precio: 210000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-6',
    nombre: 'Fuente EVGA 700W GD 80 Plus Gold',
    categoria: { _id: 'cat-hardware', name: 'Componentes y Hardware' },
    descripcion: '700W de potencia continua, eficiencia 90% y protección integral contra sobretensión.',
    precio: 155000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // Domótica y Automatización
  {
    _id: 'prod-7',
    nombre: 'Módulo Relé WiFi Inteligente Sonoff Mini R2',
    categoria: { _id: 'cat-domotica', name: 'Domótica y Automatización' },
    descripcion: 'Interruptor inteligente DIY bidireccional, compatible con Alexa, Google Home y escenas eWeLink.',
    precio: 18000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-8',
    nombre: 'Actuador Lineal Eléctrico 12V 100mm',
    categoria: { _id: 'cat-domotica', name: 'Domótica y Automatización' },
    descripcion: 'Carrera de 100mm, fuerza de empuje 750N, velocidad 10mm/s con finales de carrera integrados.',
    precio: 65000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-9',
    nombre: 'Placa de Desarrollo ESP32 Wi-Fi + Bluetooth',
    categoria: { _id: 'cat-domotica', name: 'Domótica y Automatización' },
    descripcion: 'Módulo NodeMCU ESP-WROOM-32, 30 pines, microUSB y procesador doble núcleo 240MHz para IoT.',
    precio: 14500,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-10',
    nombre: 'Placa de Desarrollo Arduino Uno R3 ATmega328P',
    categoria: { _id: 'cat-domotica', name: 'Domótica y Automatización' },
    descripcion: 'Microcontrolador ATmega328P, 14 pines E/S digitales y 6 entradas analógicas para prototipado.',
    precio: 22000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-11',
    nombre: 'Sensor de Temperatura y Humedad DHT22 (AM2302)',
    categoria: { _id: 'cat-domotica', name: 'Domótica y Automatización' },
    descripcion: 'Sensor digital calibrado de alta precisión para monitoreo ambiental y proyectos domóticos.',
    precio: 9800,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-12',
    nombre: 'Sensor de Movimiento Infrarrojo PIR HC-SR501',
    categoria: { _id: 'cat-domotica', name: 'Domótica y Automatización' },
    descripcion: 'Sensor piroeléctrico para detección de presencia con ajuste fino de sensibilidad y retardo.',
    precio: 5200,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-13',
    nombre: 'Pasarela de Red Gateway Zigbee 3.0 Tuya Smart',
    categoria: { _id: 'cat-domotica', name: 'Domótica y Automatización' },
    descripcion: 'Hub inalámbrico multi-dispositivo Zigbee y Bluetooth Mesh para centralizar sensores y relés.',
    precio: 48000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // Simuladores y Gaming
  {
    _id: 'prod-14',
    nombre: 'Volante y Pedalera Logitech G29 Driving Force',
    categoria: { _id: 'cat-simracing', name: 'Simuladores y Gaming' },
    descripcion: 'Force Feedback de doble motor, aro revestido en cuero cosido a mano y pedalera con freno progresivo.',
    precio: 450000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-15',
    nombre: 'Base Direct Drive Moza Racing R9 V2 (9 Nm)',
    categoria: { _id: 'cat-simracing', name: 'Simuladores y Gaming' },
    descripcion: 'Motor Direct Drive servo industrial de 9 Nm de torque pico y chasis en aluminio grado aviación.',
    precio: 890000,
    disponible: true,
    destacado: true,
    imagenes: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-16',
    nombre: 'Volante Moza GS V2P GT Wheel Alcántara',
    categoria: { _id: 'cat-simracing', name: 'Simuladores y Gaming' },
    descripcion: 'Aro GT3 de 300mm en fibra de carbono forjada, levas magnéticas con doble embrague y telemetría RGB.',
    precio: 720000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-17',
    nombre: 'Pedalera Fanatec ClubSport Pedals V3',
    categoria: { _id: 'cat-simracing', name: 'Simuladores y Gaming' },
    descripcion: 'Pedalera mecanizada CNC con celda de carga de 90kg en freno, motores de vibración y sensores Hall.',
    precio: 780000,
    disponible: false,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-18',
    nombre: 'Monitor Ultrawide Curvo Samsung Odyssey G9 49"',
    categoria: { _id: 'cat-simracing', name: 'Simuladores y Gaming' },
    descripcion: 'Dual QHD 5120x1440, curvatura inmersiva 1000R, panel QLED 240Hz, 1ms y compatibilidad G-Sync.',
    precio: 2100000,
    disponible: true,
    destacado: true,
    imagenes: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-19',
    nombre: 'Monitor Gamer Ultrawide LG 34" UltraGear 160Hz',
    categoria: { _id: 'cat-simracing', name: 'Simuladores y Gaming' },
    descripcion: 'Resolución WQHD 3440x1440, panel curvo Nano IPS, 160Hz, 1ms MBR y soporte HDR10.',
    precio: 890000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // Conectividad
  {
    _id: 'prod-20',
    nombre: 'Router Wi-Fi 6 TP-Link Archer AX73 Gigabit',
    categoria: { _id: 'cat-conectividad', name: 'Conectividad' },
    descripcion: 'AX5400 Dual-Band, 6 antenas de alta ganancia, tecnología OneMesh, OFDMA y puerto USB 3.0.',
    precio: 195000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-21',
    nombre: 'Sistema Mesh ASUS ZenWiFi XT8 WiFi 6 AX6600',
    categoria: { _id: 'cat-conectividad', name: 'Conectividad' },
    descripcion: 'Pack x2 nodos tri-banda, cobertura hasta 500 m², puerto WAN 2.5G y seguridad AiProtection Pro.',
    precio: 580000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-22',
    nombre: 'Adaptador PCI-e WiFi 6E TP-Link Archer TXE75E',
    categoria: { _id: 'cat-conectividad', name: 'Conectividad' },
    descripcion: 'Tri-Banda (6GHz, 5GHz, 2.4GHz), Bluetooth 5.3, disipador térmico y base con antenas imantadas.',
    precio: 88000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    _id: 'prod-23',
    nombre: 'Adaptador USB WiFi TP-Link Archer T3U Plus',
    categoria: { _id: 'cat-conectividad', name: 'Conectividad' },
    descripcion: 'AC1300 Dual Band con antena multidireccional de alta ganancia de 5dBi y conexión USB 3.0.',
    precio: 32000,
    disponible: true,
    destacado: false,
    imagenes: [
      'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=80'
    ]
  }
];

export const INITIAL_INFO = {
  nombre: 'Tienda Electrónica & Hardware UADE',
  descripcion:
    'Especialistas en componentes de alta gama para PC, simracing profesional, domótica inteligente y soluciones de conectividad de red con asesoramiento técnico y garantía oficial.',
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

export const INITIAL_CONSULTAS = [
  {
    _id: 'cons-1',
    nombre: 'Martín Gómez',
    email: 'mgomez@gmail.com',
    telefono: '11 4321-8899',
    asunto: 'Compatibilidad Base Moza R9 con cockpit aluminio',
    mensaje: 'Hola! Quería consultar si tienen en stock la base Moza R9 V2 y si incluye los tornillos para montaje frontal en perfil de aluminio.',
    estado: 'pendiente',
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString()
  },
  {
    _id: 'cons-2',
    nombre: 'Lucía Fernández',
    email: 'lucia.fernandez@empresa.com.ar',
    telefono: '11 6789-1234',
    asunto: 'Presupuesto kits ESP32 y sensores DHT22',
    mensaje: 'Buenas tardes, necesitamos 15 placas ESP32 y 15 sensores DHT22 para un laboratorio de IoT. ¿Hacen factura A y envío a Córdoba?',
    estado: 'leida',
    createdAt: new Date(Date.now() - 3600 * 1000 * 26).toISOString()
  }
];

