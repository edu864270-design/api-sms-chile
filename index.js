const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clave secreta para proteger tus mensajes (puedes cambiarla en las variables de entorno de Render)
const API_KEY = process.env.API_KEY || 'clave_secreta_chile_2026';

// Almacenamiento en memoria de los ultimos 50 SMS
const bandejaEntrada = [];

// Ruta principal para verificar que el servidor esta encendido
app.get('/', (req, res) => {
  res.send('API de recepcion SMS Chile funcionando correctamente.');
});

// 1. WEBHOOK: Pega esta ruta en Telnyx, Zavu o Twilio (/webhook/sms)
app.post('/webhook/sms', (req, res) => {
  const datos = req.body.data ? req.body.data.payload : req.body;

  // Extrae el numero destino de forma segura (soporta formato array de Telnyx o string)
  let destino = '+569XXXXXXXX';
  if (Array.isArray(datos.to) && datos.to[0]?.phone_number) {
    destino = datos.to[0].phone_number;
  } else if (datos.to?.phone_number) {
    destino = datos.to.phone_number;
  } else if (datos.To) {
    destino = datos.To;
  }

  const nuevoSms = {
    id: Date.now(),
    de: datos.from?.phone_number || datos.From || 'Desconocido',
    para: destino,
    mensaje: datos.text || datos.Body || '',
    fecha: new Date().toISOString()
  };

  if (nuevoSms.mensaje) {
    bandejaEntrada.unshift(nuevoSms);
    if (bandejaEntrada.length > 50) bandejaEntrada.pop();
    console.log('Nuevo SMS recibido:', nuevoSms);
  }

  res.status(200).send('OK');
});

// 2. CONSULTA: Ruta protegida para leer tus SMS (/api/mensajes?key=tu_clave)
app.get('/api/mensajes', (req, res) => {
  const claveRecibida = req.query.key || req.headers['x-api-key'];

  if (claveRecibida !== API_KEY) {
    return res.status(401).json({ error: 'Acceso denegado. Clave API incorrecta.' });
  }

  res.json({
    total: bandejaEntrada.length,
    mensajes: bandejaEntrada
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
