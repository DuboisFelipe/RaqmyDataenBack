# Backend Raqmy Dataen - Formulario de Contacto

Backend en Node.js con Express y MySQL para procesar el formulario de contacto del sitio web de Raqmy Dataen.

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL (versión 5.7 o superior) o MariaDB
- npm o yarn

## 🚀 Instalación

### 1. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar la base de datos

#### Opción A: Usando MySQL Workbench o phpMyAdmin
1. Abre tu cliente MySQL favorito
2. Ejecuta el archivo `database.sql` para crear la base de datos y la tabla

#### Opción B: Desde la línea de comandos
\`\`\`bash
mysql -u root -p < database.sql
\`\`\`

### 3. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env`:
\`\`\`bash
cp .env.example .env
\`\`\`

2. Edita el archivo `.env` con tus credenciales de MySQL:
\`\`\`env
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=raqmy_dataen
\`\`\`

## ▶️ Ejecutar el servidor

### Modo producción
\`\`\`bash
npm start
\`\`\`

### Modo desarrollo (con auto-reload)
\`\`\`bash
npm run dev
\`\`\`

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints

### POST /contacto
Recibe los datos del formulario de contacto.

**Body (JSON o form-data):**
\`\`\`json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "+54 9 11 1234-5678",
  "mensaje": "Consulta sobre servicios"
}
\`\`\`

**Respuesta exitosa (201):**
\`\`\`json
{
  "success": true,
  "message": "Mensaje enviado correctamente",
  "id": 1
}
\`\`\`

**Respuesta de error (400):**
\`\`\`json
{
  "success": false,
  "error": "Los campos nombre, email y mensaje son obligatorios"
}
\`\`\`

### GET /health
Verifica que el servidor esté funcionando.

**Respuesta:**
\`\`\`json
{
  "status": "OK",
  "message": "Servidor funcionando correctamente"
}
\`\`\`

## 🗄️ Estructura de la Base de Datos

### Tabla: mensajes

| Campo    | Tipo         | Descripción                    |
|----------|--------------|--------------------------------|
| id       | INT          | ID autoincremental (PK)        |
| nombre   | VARCHAR(255) | Nombre del contacto            |
| email    | VARCHAR(255) | Email del contacto             |
| telefono | VARCHAR(50)  | Teléfono (opcional)            |
| mensaje  | TEXT         | Mensaje del contacto           |
| fecha    | TIMESTAMP    | Fecha y hora del mensaje       |

## 🔒 Validaciones

- **nombre**: Obligatorio, no vacío
- **email**: Obligatorio, formato válido
- **telefono**: Opcional
- **mensaje**: Obligatorio, no vacío

## 🛠️ Tecnologías Utilizadas

- **Express**: Framework web para Node.js
- **MySQL2**: Cliente MySQL con soporte para Promises
- **dotenv**: Gestión de variables de entorno
- **cors**: Middleware para habilitar CORS

## 📝 Notas

- Los mensajes se guardan con timestamp automático
- El servidor valida los campos obligatorios antes de guardar
- Se incluyen índices en la tabla para optimizar consultas por fecha y email
- El servidor usa un pool de conexiones para mejor rendimiento

## 🐛 Troubleshooting

### Error: "Access denied for user"
Verifica que las credenciales en el archivo `.env` sean correctas.

### Error: "Unknown database"
Asegúrate de haber ejecutado el archivo `database.sql` para crear la base de datos.

### Error: "ECONNREFUSED"
Verifica que MySQL esté corriendo en tu sistema.
