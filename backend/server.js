require("dotenv").config()
const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")
const session = require("express-session")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    secret: process.env.SESSION_SECRET || "raqmy-dataen-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 horas
      httpOnly: true,
      secure: false, // Cambiar a true si usas HTTPS
      sameSite: "lax",
    },
  }),
)

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "raqmy_dataen",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Pool de conexiones
let pool

async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig)
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log("✅ Conexión a la base de datos establecida")
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error)
    process.exit(1)
  }
}

function requireAuth(req, res, next) {
  console.log("[v0] Verificando autenticación:", {
    isAuthenticated: req.session?.isAuthenticated,
    sessionID: req.sessionID,
  })

  if (req.session && req.session.isAuthenticated) {
    return next()
  }
  res.redirect("/admin/login")
}

// Endpoint POST /contacto
app.post("/contacto", async (req, res) => {
  const { nombre, email, telefono, mensaje } = req.body

  // Validación de campos obligatorios
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({
      success: false,
      error: "Los campos nombre, email y mensaje son obligatorios",
    })
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "El formato del email no es válido",
    })
  }

  try {
    // Insertar en la base de datos
    const query = `
      INSERT INTO mensajes (nombre, email, telefono, mensaje, fecha)
      VALUES (?, ?, ?, ?, NOW())
    `

    const [result] = await pool.execute(query, [
      nombre.trim(),
      email.trim(),
      telefono ? telefono.trim() : null,
      mensaje.trim(),
    ])

    console.log(`✅ Nuevo mensaje guardado - ID: ${result.insertId}`)

    res.status(201).json({
      success: true,
      message: "Mensaje enviado correctamente",
      id: result.insertId,
    })
  } catch (error) {
    console.error("❌ Error al guardar el mensaje:", error)
    res.status(500).json({
      success: false,
      error: "Error al procesar el mensaje. Por favor, intente nuevamente.",
    })
  }
})

// Endpoint de prueba
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Servidor funcionando correctamente" })
})

// GET /admin/login - Mostrar formulario de login
app.get("/admin/login", (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect("/admin")
  }
  res.render("login", { error: null })
})

// POST /admin/login - Procesar login
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body

  const adminUsername = process.env.ADMIN_USERNAME || "admin"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

  console.log("[v0] Intento de login:", { username, adminUsername })

  if (username === adminUsername && password === adminPassword) {
    req.session.isAuthenticated = true
    req.session.username = username

    req.session.save((err) => {
      if (err) {
        console.error("❌ Error al guardar sesión:", err)
        return res.render("login", { error: "Error al iniciar sesión. Intente nuevamente." })
      }
      console.log("✅ Sesión guardada exitosamente, redirigiendo a /admin")
      return res.redirect("/admin")
    })
  } else {
    console.log("❌ Credenciales incorrectas")
    res.render("login", { error: "Usuario o contraseña incorrectos" })
  }
})

// GET /admin - Panel de administración
app.get("/admin", requireAuth, async (req, res) => {
  try {
    console.log("[v0] Accediendo al panel de admin")

    const query = "SELECT * FROM mensajes ORDER BY fecha DESC"

    console.log("[v0] Ejecutando query:", query)

    const [mensajes] = await pool.execute(query)

    console.log(`[v0] Mensajes encontrados: ${mensajes.length}`)

    res.render("admin", {
      mensajes,
      username: req.session.username,
    })
  } catch (error) {
    console.error("❌ Error al obtener mensajes:", error)
    res.status(500).send(`Error al cargar el panel de administración: ${error.message}`)
  }
})

// GET /admin/logout - Cerrar sesión
app.get("/admin/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err)
    }
    res.redirect("/admin/login")
  })
})

// Iniciar servidor
async function startServer() {
  await initializeDatabase()

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`📝 Endpoint de contacto: http://localhost:${PORT}/contacto`)
  })
}

startServer()
