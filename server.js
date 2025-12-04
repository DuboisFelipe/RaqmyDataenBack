require("dotenv").config()
const express = require("express")
const mysql = require("mysql2/promise")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuración de la base de datos
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "raqmy_dataen",
}

// Pool de conexiones
let pool

async function initializeDatabase() {
  try {
    pool = mysql.createPool(dbConfig)
    console.log("✅ Conexión a la base de datos establecida")
  } catch (error) {
    console.error("❌ Error al conectar con la base de datos:", error)
    process.exit(1)
  }
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

// Iniciar servidor
async function startServer() {
  await initializeDatabase()

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`📝 Endpoint de contacto: http://localhost:${PORT}/contacto`)
  })
}

startServer()
