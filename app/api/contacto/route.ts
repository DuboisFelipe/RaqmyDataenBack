import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, mensaje } = body

    // Validación simple
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { success: false, error: "Los campos nombre, email y mensaje son obligatorios" },
        { status: 400 },
      )
    }

    // Conexión a la base de datos
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    })

    // Insertar mensaje
    await connection.execute("INSERT INTO mensajes (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)", [
      nombre,
      email,
      telefono || null,
      mensaje,
    ])

    await connection.end()

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado correctamente",
    })
  } catch (error) {
    console.error("Error al procesar mensaje:", error)
    return NextResponse.json({ success: false, error: "Error al procesar el mensaje" }, { status: 500 })
  }
}
