# API de Recepcion SMS Chile

Servidor minimalista en Node.js y Express para recibir y consultar mensajes SMS enviados a un numero virtual de Chile (+56 9) mediante webhooks.

## Endpoints

* `GET /`: Verifica que el servidor esta activo.
* `POST /webhook/sms`: Ruta para configurar como Webhook entrante en Telnyx, Zavu o Twilio.
* `GET /api/mensajes?key=clave_secreta_chile_2026`: Devuelve los ultimos 50 mensajes recibidos en formato JSON.

## Variables de entorno

* `PORT`: Puerto del servidor (Render lo asigna automaticamente).
* `API_KEY`: Clave secreta para consultar `/api/mensajes` (por defecto: `clave_secreta_chile_2026`).
