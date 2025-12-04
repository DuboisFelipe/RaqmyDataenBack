# Backend Raqmy Dataen - Formulario de Contacto

Backend en Node.js con Express y MySQL para procesar el formulario de contacto del sitio web de Raqmy Dataen.

## 📋 Requisitos Previos

- Node.js (versión 14 o superior)
- MySQL (versión 5.7 o superior) o MariaDB
- npm o yarn

## 🚀 Instalación

### 1. Navegar a la carpeta backend

\`\`\`bash
cd backend
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar la base de datos

#### Opción A: Usando MySQL Workbench o phpMyAdmin
1. Abre tu cliente MySQL favorito
2. Ejecuta el archivo `database.sql` para crear la base de datos y la tabla

#### Opción B: Desde la línea de comandos
\`\`\`bash
mysql -u root -p < database.sql
\`\`\`

### 4. Configurar variables de entorno

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

ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_contraseña_segura_aqui
SESSION_SECRET=tu_secreto_de_sesion_aleatorio_aqui
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

### GET /admin/login
Muestra el formulario de inicio de sesión del panel de administración.

### POST /admin/login
Procesa el inicio de sesión del administrador.

**Body (form-data):**
\`\`\`json
{
  "username": "admin",
  "password": "tu_contraseña"
}
\`\`\`

### GET /admin
Panel de administración protegido. Muestra todos los mensajes de contacto con búsqueda y paginación.

**Query params:**
- `page`: Número de página (default: 1)
- `search`: Búsqueda por nombre o email

### GET /admin/logout
Cierra la sesión del administrador.

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

## 👤 Panel de Administración

El backend incluye un panel de administración web para visualizar los mensajes de contacto.

### Acceso al Panel

1. Navega a `http://localhost:3000/admin/login`
2. Ingresa las credenciales configuradas en el archivo `.env`:
   - Usuario: valor de `ADMIN_USERNAME`
   - Contraseña: valor de `ADMIN_PASSWORD`

### Funcionalidades

- **Visualización de mensajes**: Tabla con todos los mensajes recibidos
- **Búsqueda**: Buscar mensajes por nombre o email
- **Paginación**: 10 mensajes por página
- **Ordenamiento**: Los mensajes más recientes aparecen primero
- **Sesión segura**: La sesión expira después de 2 horas de inactividad

### Seguridad

- Las contraseñas deben configurarse en el archivo `.env` (nunca en el código)
- Las sesiones están protegidas con `httpOnly` cookies
- Se recomienda usar contraseñas seguras y cambiar el `SESSION_SECRET`

## 🛠️ Tecnologías Utilizadas

- **Express**: Framework web para Node.js
- **MySQL2**: Cliente MySQL con soporte para Promises
- **dotenv**: Gestión de variables de entorno
- **cors**: Middleware para habilitar CORS
- **express-session**: Gestión de sesiones para el panel de administración
- **ejs**: Motor de plantillas para las vistas del panel

## 🐛 Troubleshooting

### Error: "Access denied for user"
Verifica que las credenciales en el archivo `.env` sean correctas.

### Error: "Unknown database"
Asegúrate de haber ejecutado el archivo `database.sql` para crear la base de datos.

### Error: "ECONNREFUSED"
Verifica que MySQL esté corriendo en tu sistema.

### Error de CORS en el frontend
Si el frontend está en un dominio diferente, asegúrate de que el servidor backend tenga CORS habilitado (ya está configurado en el código).

### No puedo acceder al panel de administración
Verifica que hayas configurado `ADMIN_USERNAME` y `ADMIN_PASSWORD` en el archivo `.env`.

### La sesión se cierra automáticamente
Las sesiones expiran después de 2 horas de inactividad. Vuelve a iniciar sesión.
